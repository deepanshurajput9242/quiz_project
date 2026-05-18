const API_URL = 'http://localhost:5000/api';

async function testQuizAPI() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newteacher2@example.com',
        password: 'password123'
      })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    
    // Extract cookie
    const cookie = loginRes.headers.get('set-cookie');
    if (!cookie) throw new Error('No cookie received');
    console.log('Login successful. Cookie obtained.');

    const headers = {
      'Content-Type': 'application/json',
      'Cookie': cookie
    };

    // 2. Create Quiz
    console.log('Creating quiz...');
    const quizData = {
      title: 'API Test Quiz',
      description: 'Testing backend logic',
      timeLimit: 10,
      questions: [
        {
          text: 'What is 1+1?',
          type: 'short-answer',
          points: 1,
          correctAnswer: '2',
          options: ['', '', '', '']
        }
      ]
    };
    
    const createRes = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(quizData)
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Create failed: ${createRes.status} ${createRes.statusText} - ${errorText}`);
    }
    const createData = await createRes.json();
    const quizId = createData._id;
    console.log('Quiz created with ID:', quizId);
    console.log('Questions created:', createData.questions.length);

    if (createData.questions.length !== 1) {
      throw new Error('Failed to create questions');
    }

    // 3. Update Quiz
    console.log('Updating quiz...');
    const questionId = createData.questions[0]; // ID of the created question
    const updateData = {
      title: 'API Test Quiz Updated',
      description: 'Testing update logic',
      timeLimit: 15,
      questions: [
        {
          _id: questionId,
          text: 'What is 2+2?', // Changed text
          type: 'short-answer',
          points: 2, // Changed points
          correctAnswer: '4',
          options: ['', '', '', '']
        },
        {
          text: 'New Question', // New question
          type: 'true-false',
          points: 1,
          correctAnswer: 'true',
          options: ['', '', '', '']
        }
      ]
    };

    const updateRes = await fetch(`${API_URL}/quizzes/${quizId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });

    if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
    console.log('Quiz updated.');
    
    // 4. Verify Update
    console.log('Verifying update...');
    const getRes = await fetch(`${API_URL}/quizzes/${quizId}`, {
      method: 'GET',
      headers
    });

    if (!getRes.ok) throw new Error(`Get failed: ${getRes.statusText}`);
    const getData = await getRes.json();
    const updatedQuestions = getData.questions;
    console.log('Updated questions count:', updatedQuestions.length);

    const q1 = updatedQuestions.find(q => q._id === questionId);
    if (q1.text !== 'What is 2+2?') throw new Error(`Failed to update question text. Got: ${q1.text}`);
    if (q1.points !== 2) throw new Error(`Failed to update question points. Got: ${q1.points}`);
    
    if (updatedQuestions.length !== 2) throw new Error(`Failed to add new question. Count: ${updatedQuestions.length}`);

    console.log('SUCCESS: Backend logic verified!');

  } catch (error) {
    console.error('TEST FAILED:', error.message);
  }
}

testQuizAPI();
