import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from './Avatar'

export default function AvatarForm({ username, avatar_url, onUpload }) {
    const [uploading, setUploading] = useState(false)

    async function uploadAvatar(event) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('你必须选择一张图片上传.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            //Size validation
            let fileSize = file.size / 1024 / 1024;
            fileSize = fileSize.toFixed(2);
            console.log(fileSize)
            if (fileSize > 2) {
                alert('图片最大2M. 你的文件已经有: ' + fileSize + ' M');
                return
            }


            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <div className="field">
            <label className="label">头像</label>
            <Avatar username={username} avatar_url={avatar_url} />
            </div>

            <div>
                <label className="button is-small primary block" htmlFor="single">
                    {uploading ? '上传中 ...' : '上传'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}