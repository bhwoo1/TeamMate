import PostClient from "./postClient";

const PostPage = async ({params}: {params: Promise<{ teamID: number, postID: number }>}) => {
    const { teamID, postID } = await params;
    
    return(
        <PostClient teamID={teamID} postID={postID} />
    );
} 

export default PostPage;