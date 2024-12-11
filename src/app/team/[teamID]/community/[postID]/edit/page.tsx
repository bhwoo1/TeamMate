import PostEditClient from "./PostEditClient";

const PostEditPage = async ({params}: {params: Promise<{ teamID: number, postID: number }>}) => {
    const { teamID, postID } = await params;
    
    return(
        <PostEditClient teamID={teamID} postID={postID} />
    );
} 

export default PostEditPage;