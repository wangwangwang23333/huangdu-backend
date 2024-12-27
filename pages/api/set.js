// 获取global的userAnswers数组
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // 获取param的index，将global.userAnswers数组中对应index的元素的default属性设为true
    if (req.method === 'GET') {
        const index = req.query.index;
        if (index < 0 || index >= global.userAnswers.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }
        // 如果global.userAnswers不存在，则初始化数组
        if (!global.userAnswers) {
            global.userAnswers = [];
        }
        global.userAnswers[index].default = true;
        return res.status(200).json(global.userAnswers);
    }
    
}