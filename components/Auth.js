import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const NameMap = {
    'login': '登录',
    'register': '注册'
}

export default function Auth(props) {
    const { type } = props;
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email, password })
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResiger = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email, password })
            if (error) throw error
        } catch (error) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    async function signInWithSocial(provider) {
        const { user, session, error } = await supabase.auth.signIn({
            provider: provider
        });
    }

    return (
        <div className="columns">
            <div className="column is-half is-offset-one-quarter">
            <h3 className='title'>加入我们</h3>
            {/* <div className='mb-4'>
                <p className="is-size-5 mb-1">Social Login</p>
                <button className='button is-fullwidth is-info mb-1' onClick={() => signInWithSocial('twitter')}>Sign in with Twitter</button>
                <button className='button is-fullwidth is-dark' onClick={() => signInWithSocial('github')}>Sign in with Github</button>
            </div> */}


            <div>
                <p className="is-size-5 mb-1">邮件登录（注册）</p>
                <div>
                    <input
                        className="input mb-2"
                        type="email"
                        placeholder="邮箱地址"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="input mb-2"
                        type="password"
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            if (type === 'login') {
                                handleLogin(email)
                            }
                            if (type === 'register') {
                                handleResiger(email)
                            }
                        }}
                            className="button is-primary is-fullwidth"
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading' : NameMap[type]}</span>
                    </button>
                </div>
                <div>
                    {
                        type === 'login' && <Link href="/register" ><a className='tag is-link is-light'>去注册</a></Link>
                    }
                    {
                        type === 'register' && <Link href="/login" ><a className='tag is-link is-light'>去登录</a></Link>
                    }
                </div>
            </div>
        </div>
        </div>
    )
}