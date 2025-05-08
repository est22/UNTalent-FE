const Typesense = require('typesense');

require('dotenv').config({ path: '../../../../.env' });

// Initialize the Typesense client
let typesense = new Typesense.Client({
  nodes: [{
    host: process.env.REACT_APP_TYPESENSE_HOST,
    port: process.env.REACT_APP_TYPESENSE_PORT,
    protocol: process.env.REACT_APP_TYPESENSE_PROTOCOL,
  }],
  apiKey: process.env.REACT_APP_TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

// Define the schema for the Typesense collection
let schema = {
  'name': 'jobs',
  'fields': [
    { 'name': 'url', 'type': 'string' },
    { 'name': 'title', 'type': 'string' },
    { 'name': 'description', 'type': 'string' },
    { 'name': 'job_labels', 'type': 'string' },
    { 'name': 'uniquecode', 'type': 'int64' },
  ],
  'default_sorting_field': 'uniquecode',
};

// Fetch jobs from API
fetch(`${process.env.REACT_APP_BASE_URL}/jobs`)
  .then(response => response.json())
  .then(jobs => {
    // Filter and process the jobs
    let data = jobs.filter(item => typeof item.title === 'string').map(item => {
      return {
        url: item.url,
        title: item.title,
        description: item.description || '',
        job_labels: item.job_labels,
        uniquecode: item.uniquecode,
      };
    });

    // Delete the old collection if it exists, then create a new one and import the data
    typesense.collections('jobs').delete()
      .catch(error => console.error('Error deleting old collection:', error))
      .then(() => typesense.collections().create(schema))
      .then(() => typesense.collections('jobs').documents().import(data))
      .then(() => console.log('Data successfully imported to Typesense!'))
      .catch(error => console.error('Error importing data to Typesense:', error));
  })
  .catch(error => console.error('Error fetching jobs:', error));
