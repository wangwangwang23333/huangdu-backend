// 获取global的userAnswers数组
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // get方法
    if (req.method === 'GET') {
        return res.status(200).json(global.userAnswers);
    }
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}