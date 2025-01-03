// 获取global的userAnswers数组
import { getUser, updateUser, createUser } from './data';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // 获取param的index，将global.userAnswers数组中对应index的元素的default属性设为true
    if (req.method === 'GET') {
       
        // 如果global.userAnswers不存在，则初始化数组
        let answers = await getUser();
        answers = [];
        await updateUser(answers);

        return res.status(200).json(global.userAnswers);
    }
    
}