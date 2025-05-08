import { callApi } from '../utils/apiHandler';

const useResumeUpload = () => {
  const resumeLabel = async (formData) => {
    const response = await callApi.post('/user/resume/label', formData, true, true);
    return response.data;
  };

  const updateResumeToUser = async (user_id, data) => {
    return await callApi.patch(`/user/${user_id}/resume`, data, false, true);
  };

  const labelVectorize = async (labeledData) => {
    const response = await callApi.post('/resume/vectorize', labeledData, false, true);
    return response.data;
  };

  const fetchJobByVectorized = async (vectorizedData) => {
    return await callApi.post('/resume/upload', vectorizedData, false, true);
  };

  const fectchJobByExistFile = async (user_id) => {
    return await callApi.get(`/resume/${user_id}/jobs`, null, true);
  };

  return {
    resumeLabel,
    labelVectorize,
    fetchJobByVectorized,
    updateResumeToUser,
    fectchJobByExistFile,
  };
};

export default useResumeUpload;
