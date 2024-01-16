import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error
            alert('查看电子邮件中的登录链接！如果收件箱中没有，请查看垃圾邮件文件夹。')
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
            <h3 className='title'>加入论坛</h3>
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
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin(email)
                        }}
                            className="button is-primary is-fullwidth"
                        disabled={loading}
                    >
                        <span>{loading ? 'Loading' : '发送邮件地址'}</span>
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}