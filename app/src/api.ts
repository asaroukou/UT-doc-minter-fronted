import axios from 'axios';

// export instance of Axios with default URL defined
export default axios.create({
  baseURL: `https://docdex.herokuapp.com`
});