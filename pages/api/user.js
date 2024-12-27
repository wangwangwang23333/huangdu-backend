import { getUser, updateUser, createUser } from './data';

// 获取global的userAnswers数组
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    

    
    if (req.method === 'GET') {
        // get方法
        let answers = await getUser();
        if (!Array.isArray(answers)) {
            answers = [];
            // set回去
            await createUser(answers);
        }
        return res.status(200).json(answers);
        
    }
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}