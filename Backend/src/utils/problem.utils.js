import axios from 'axios';
import dotenv from "dotenv"
dotenv.config();

function getLanguageId(lang)
{
    const language = {
        "cpp" : 54,
        "java" : 62,
        "javascript" : 63,
        "python" : 71
    }

    lang = lang.toLowerCase();
    return language[lang];
}

async function submitBatch(submission)
{

const options = {
  method: 'POST',
  url: 'https://judge029.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': 'judge029.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {submissions: submission}
};

async function fetchData() {
	try 
    {
		const response = await axios.request(options);
        return response.data;
	} 
    catch (error) 
    {
		console.error(error);
        throw error;
	}
}

return await fetchData();
}

async function submitToken(token)
{
  const tokenStr = token.join(",");
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const options = {
  method: 'GET',
  url: 'https://judge029.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokenStr,
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': 'judge029.p.rapidapi.com'
  }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while(true)
  {
    const result = await fetchData();
    const isResultObtained = result.submissions.every((r)=>r.status_id>2)

    if(isResultObtained)
        return result.submissions;

    await sleep(1000)
  }
}

export  {getLanguageId,submitBatch,submitToken};
