const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

// get API key from .env
const API_KEY = process.env.OPENAI_KEY;
const ORGANIZATION = process.env.OPENAI_ORGANIZATION;
const configuration = new Configuration({
	organization: ORGANIZATION,
	apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to check if patient is logged in
function isLoggedIn(req, res, next) {
	if (req.session.patient) {
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
}
router.use(isLoggedIn);

// POST /ai
// Get AI answer
router.post("/", async (req, res) => {
	// get question from body
	const question = req.body.question;

	// get answer from AI
	const answer = await getAnswer(question);

	// send answer to client
	res.send(answer);
});

// Function to get answer from AI
async function getAnswer(question) {
	const prompt = `You are a doctor's assistant. You are helping a patient with a medical condition. Give the patient a few safe recommendations for their condition, and tell them if it's urgent it is to see a doctor. Give the patient a possible diagnosis, recommendations and urgency.
  
  Symptoms: ${question}.`;

	console.log(prompt);
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		temperature: 0.7,
		max_tokens: 256,
		messages: [{ role: "user", content: prompt }],
	});

	return completion.data.choices[0].message;
}

module.exports = router;
