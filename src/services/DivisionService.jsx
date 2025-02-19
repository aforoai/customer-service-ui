import axios from "axios";

const API_BASE_URL = "/v1/api";

const DivisionService = {
  getAllDivisions: (organizationId) =>
    axios
      .get(`${API_BASE_URL}/organizations/${organizationId}/divisions`)
      .then((response) => response.data._embedded?.divisionDTOList || []),

  createDivision: async (organizationId, data) => {
    return axios
      .post(`${API_BASE_URL}/organizations/${organizationId}/divisions`, data)
      .then((response) => response.data);
  },

  updateDivision: (divisionId, data) =>
    axios.put(`${API_BASE_URL}/divisions/${divisionId}`, data).then((response) => response.data),

  deleteDivision: (divisionId) =>
    axios.delete(`${API_BASE_URL}/divisions/${divisionId}`).then((response) => response.data),
};

export default DivisionService;
