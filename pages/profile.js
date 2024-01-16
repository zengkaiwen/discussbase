import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import AvatarForm from '../components/AvatarForm'
import { supabase } from '../utils/supabaseClient'

export default function Profile() {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState([])
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(() => {
        setUser(supabase.auth.user())
        getProfile() 
    }, [])


    async function getProfile() {
        try {
            setLoading(true)

            const user = supabase.auth.user()
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (error) {
                //if no profiles yet
                setError(true)
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setError(false)
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true)

            //temporary validation
            if (username == null) {
                alert('昵称必填')
                return
            }
            if (username.trim().length < 1 || username.trim().length > 16) {
                alert('昵称不能少于1个字或多于16个字')
                return
            }
            // var expr = /^[a-zA-Z0-9_]{4,12}$/;
            // if (!expr.test(username)) {
            //     alert('Only Character, number and _ allowed')
            //     return
            // }

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal',
            })

            if (error) {
                throw error
            } else {
                window.location.href = '/posts'
            }
        } catch (error) {
            if (error.message.includes('duplicate key value'))
                alert('昵称已存在')
            else if (error.message.includes('username'))
                alert("昵称不能为空")
            else
                alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
        <div className="form-widget">
            <h1 className='is-size-2 mb-5'>更新个人信息</h1>

            {error &&
                <div className='notification'>
                    <h3><b> Oops </b></h3>
                    看起来您还没有任何个人资料。请添加您的昵称
                </div>
            }

            <div className="field">
                <label className="label" htmlFor="email">邮箱</label>
                <div className="control">
                    <input id="email" className="input" type="text" value={user.email} disabled />
                </div>
            </div>

            <div className="field">
                <label className="label" htmlFor="username">昵称</label>
                <div className="control">
                    <input id="username"
                        className="input"
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
            </div>

            {/* <div className="field">
                <label className="label" htmlFor="website">Website</label>
                <div className="control">
                    <input id="website"
                        className="input"
                        type="text"
                        value={website || ''}
                        onChange={(e) => setWebsite(e.target.value)} />
                </div>
            </div> */}

            <AvatarForm
                username={username}
                avatar_url={avatar_url}
                onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, website, avatar_url: url })
                }}
            />

            <div>
                <button
                    className="button is-primary is-fullwidth"
                    onClick={() => updateProfile({ username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? '加载中 ...' : '更新'}
                </button>
            </div>
        </div>
        </Layout>
    )
}
