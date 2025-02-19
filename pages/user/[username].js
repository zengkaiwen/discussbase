import React from 'react';
import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout';
import Link from 'next/link';
import Avatar from '../../components/Avatar';

export default function PostByTag({ user }) {
    // console.log(user)
    const isMe = React.useMemo(() => {
        if (!user || !supabase.auth.user()) return false;
        return user.id === supabase.auth.user().id;
    }, [user]);

    return (
        <Layout>
            <div className="columns">
                <div className="column is-half is-offset-one-quarter">
                    <h3 className='title'>个人主页</h3>
                    <Avatar username={user.username} avatar_url={user.avatar_url}></Avatar>
                    <p>@{user.username}</p>
                    {user.website &&
                        <p> <Link href={user.website}><a>{user.website}</a></Link> </p>
                    }
                    
                    {isMe && (
                        <>
                            <div className='mt-3'>
                                <h3>帖子列表：</h3>
                                {user.posts.map((post, index) => (
                                    <li key={index}>
                                        <Link href={'/posts/' + post.slug}><a className='has-text-info'> {post.title} </a></Link>
                                    </li>
                                ))}
                            </div>

                            <div className='mt-3'>
                                <h3>评论列表：</h3>
                                {user.replies.filter((reply) => !!reply.posts?.slug).map((reply, index) => (
                                    <li key={index}>
                                        <Link href={'/posts/' + reply.posts?.slug}><a className='has-text-info'> {reply.body.substr(0, 50)}... </a></Link>
                                    </li>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { data: user, error } = await supabase
        .from('profiles')
        .select(`
            *,
            posts!user_id (user_id, title, slug, created_at),
            replies(post_id, body, created_at, posts(slug))
        `)
        .eq('username', context.params.username)
        .order('created_at', { ascending: false, foreignTable: 'posts' })
        .order('created_at', { ascending: false, foreignTable: 'replies' })
        .single()

    console.log(error)

    if (!user) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            user
        },
    };
}
