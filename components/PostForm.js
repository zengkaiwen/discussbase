import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import getCategories from '../utils/getCategories';
import isProfileExists from '../utils/isProfileExists';
import { supabase } from '../utils/supabaseClient';
import Layout from './Layout';

export default function Form({slug}) {
    const [post, setPost] = useState(null)
    const { handleSubmit, register, setValue, formState: { errors } } = useForm();
    const categories = getCategories()
    const user_session = supabase.auth.session()

    useEffect(() => { 
        (async () => {
            //Redirect if not logged In
            if (user_session == null) {
                window.location.href = '/login'
            }

            const profileExists = await isProfileExists()
            if (!profileExists) {
                alert('请先去登录或去个人信息页面创建昵称')
                window.location.href = '/login'
            }
        })();
    }, [user_session])

    useEffect(() => {
        //Edit Mode
        if(slug != undefined) {
            (async () => {
                const { data: post, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (error) {
                    throw error
                }

                if (post) {
                    setPost(post)
                    setValue('title', post.title)
                    setValue('body', post.body)
                    setValue('tag', post.tag)
                }
            })();
        }
    }, [slug, setValue])

    const onSubmit = handleSubmit(async (formData) => {
        let method = 'POST'
        let api_endpoint = '/api/posts/create'

        //attach session user
        formData['access_token'] = user_session.access_token

        //On Edit Mode
        if(post){
            method = 'PUT'
            api_endpoint = '/api/posts/update'
            formData['slug'] = slug
        }

        fetch(api_endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => response.json())
        .then(data => {
            window.location.href = `/posts/${data.slug}`
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    return (
            <Layout>
            <Head>
                <title>帖子</title>
            </Head>

            <h1 className='is-size-3 mb-2'>{post != null ? '编辑' : '创建'}帖子</h1>
            <form onSubmit={onSubmit}>
                <div className='fields mb-4'>
                    <label className='label'>标题</label>
                    <input
                        className='input'
                        type="text"
                        placeholder="帖子标题"
                        defaultValue={post != null ? post.title : ''}
                        {...register('title', { required: '标题必填', 
                            minLength: { value: 2, message: '最少 2 个字'}})}
                    />
                    {errors.title && (
                        <span role="alert" className="has-text-danger">
                            {errors.title.message}
                        </span>
                    )}
                </div>

                <div className='fields mb-4'>
                    <label className='label'>内容</label>
                    <textarea
                        className='textarea'
                        placeholder="我想说或询问的内容 ..."
                        defaultValue={post != null ? post.body : ''}
                        {...register('body', { required: '内容必填', 
                            minLength: { value: 10, message: '最少 10 个字'}})}
                    >
                    </textarea>
                    {errors.body && (
                        <span role="alert" className="has-text-danger">
                            {errors.body.message}
                        </span>
                    )}
                </div>

                <div className='fields mb-4'>
                    <label className='label'>分类</label>
                    <div className='select'>
                    <select {...register("tag", { required: '分类必填'})}>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat.key}>{cat.name} - {cat.desc} </option>
                        ))}
                    </select>
                    </div>
                    {errors.tag && (
                        <span role="alert" className="has-text-danger">
                            {errors.tag.message}
                        </span>
                    )}
                </div>

                <div className="submit mt-5">
                    <button type="submit" className="button is-fullwidth is-primary">
                        {post != null ? '更新' : '提交'}
                    </button>
                </div>
            </form>
            </Layout>
    )
}
