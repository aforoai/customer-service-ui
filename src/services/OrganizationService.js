import axios from "axios";

const API_BASE_URL = "/v1/api";

const OrganizationService = {
  getAllOrganizations: () =>
    axios
      .get(`${API_BASE_URL}/organizations?page=0&size=20&sort=organizationId`)
      .then((response) => response.data._embedded.organizationDTOList),

  createOrganization: (data) =>
    axios.post(`${API_BASE_URL}/organizations`, data).then((response) => response.data),

  deleteOrganization: (id) =>
    axios.delete(`${API_BASE_URL}/organizations/${id}`).then((response) => response.data),

  updateOrganization: (id, data) =>
    axios.put(`${API_BASE_URL}/organizations/${id}`, data).then((response) => response.data),
};

export default OrganizationService;
