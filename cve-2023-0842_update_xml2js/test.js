const express = require('express');
const { parseString } = require('xml2js');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.text({ type: 'application/xml' }));

// 사용자 데이터
const users = {
    'user1': { 
        username: 'user1', 
        role: 'user', 
        name: '일반 사용자'
    }
};

// API 엔드포인트
app.get('/api/user', (req, res) => {
    res.json(users['user1']);
});

app.post('/api/update-profile', (req, res) => {
    const xml = req.body;
    
    parseString(xml, (err, result) => {
        if (err) {
            return res.status(400).json({ 
                success: false,
                error: '잘못된 XML 형식입니다.' 
            });
        }

        console.log('Parsed result:', JSON.stringify(result, null, 2));

        // 권한 검증
        if (result.hasOwnProperty("role") && 
            result.role?.[0]?.toLowerCase() === "admin") {
            return res.status(403).json({ 
                success: false,
                error: '관리자 권한으로 변경할 수 없습니다.' 
            });
        }

        // 프로필 업데이트
        const user = users['user1'];
        if (result.__proto__ && result.__proto__.role) {
            user.role = result.__proto__.role[0];
        }
        
        res.json({ 
            success: true,
            message: '프로필이 업데이트되었습니다.',
            currentRole: user.role,
            profile: user
        });
    });
});

app.get('/admin', (req, res) => {
    const user = users['user1'];
    
    if (user?.role === 'admin') {
        res.json({
            success: true,
            message: '관리자 페이지 접근 성공!',
            user: user
        });
    } else {
        res.status(403).json({
            success: false,
            error: '접근 권한이 없습니다. 관리자만 접근할 수 있습니다.'
        });
    }
});

app.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행중입니다.');
});
