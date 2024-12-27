import {get, set} from '@vercel/edge-config';

// 获取user数据
export const config = {
    matcher: '/user',
    runtime: 'edge',
    // 配置connection string

};



export async function getUser() {
    const user = await get('user');
    return user;
}



// set user数据
export async function createUser(user) {
    
    try {
        const updateEdgeConfig = await fetch(
          'https://api.vercel.com/v1/edge-config/ecfg_vmiwjcnfpwzzv2wzm1dupaghjdcl/items',
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  operation: 'create',
                  key: 'user',
                  value: user,
                },
              ],
            }),
          },
        );
        const result = await updateEdgeConfig.json();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
}

export async function updateUser(user) {
    
    try {
        const updateEdgeConfig = await fetch(
          'https://api.vercel.com/v1/edge-config/ecfg_vmiwjcnfpwzzv2wzm1dupaghjdcl/items',
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  operation: 'update',
                  key: 'user',
                  value: user,
                },
              ],
            }),
          },
        );
        const result = await updateEdgeConfig.json();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
}