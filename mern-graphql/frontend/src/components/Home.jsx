// import React, { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { useContext } from 'react';
// import { Grid, Transition, Header, Segment, Loader, Button } from 'semantic-ui-react';
// import { AuthContext } from '../context/auth';
// import { GET_POSTS } from '../utils/graphqlQueries';
// import AddPost from './AddPost';
// import Card from './Card';

// function Home() {
//     const { loading, error, data } = useQuery(GET_POSTS);
//     const { user } = useContext(AuthContext);
    
//     // State to toggle the "View Blog" functionality
//     const [showPosts, setShowPosts] = useState(false);

//     // Toggle the posts visibility when the button is clicked
//     const handleViewBlogClick = () => setShowPosts(!showPosts);

//     return (
//         <Grid columns={1} padded style={{ marginTop: '20px' }}>
//             <Grid.Row>
//                 <Grid.Column width={16} textAlign="center">
//                     <Header as="h1">Recent Posts</Header>
//                 </Grid.Column>
//             </Grid.Row>

//             <Grid.Row>
//                 {/* Show 'Add Post' Button only if the user is logged in, take full width */}
//                 {user && (
//                     <Grid.Column width={16}>
//                         <Segment padded="very" style={{ textAlign: 'center' }}>
//                             <AddPost />
//                         </Segment>
//                     </Grid.Column>
//                 )}
//             </Grid.Row>

//             {/* View Blog Button below Add Post */}
//             <Grid.Row>
//                 <Grid.Column width={16} textAlign="center">
//                     <Button 
//                         primary 
//                         onClick={handleViewBlogClick} 
//                         style={{ marginBottom: '20px' }}
//                     >
//                         {showPosts ? 'Hide Blog' : 'View Blog'}
//                     </Button>
//                 </Grid.Column>
//             </Grid.Row>

//             {/* Show Posts only when 'View Blog' is clicked */}
//             {showPosts && (
//                 <Grid.Row>
//                     {/* If posts are loading, show a loader */}
//                     {loading ? (
//                         <Grid.Column textAlign="center" width={16}>
//                             <Loader active inline="centered" size="large" />
//                         </Grid.Column>
//                     ) : (
//                         <Transition.Group>
//                             {data?.getPosts?.map(post => (
//                                 <Grid.Column key={post.id} style={{ marginBottom: 20 }} width={16}>
//                                     <Card post={post} />
//                                 </Grid.Column>
//                             ))}
//                         </Transition.Group>
//                     )}
//                 </Grid.Row>
//             )}
//         </Grid>
//     );
// }

// export default Home;
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { Grid, Transition, Header, Segment, Loader, Button } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { GET_POSTS } from '../utils/graphqlQueries';
import AddPost from './AddPost';
import Card from './Card';

function Home() {
    const { user } = useContext(AuthContext);
    
    // State to toggle the "View Blog" functionality
    const [showPosts, setShowPosts] = useState(false);
    
    // State for infinite scroll
    const [cursor, setCursor] = useState(null); // Cursor for pagination
    const [posts, setPosts] = useState([]); // List of posts
    const [loading, setLoading] = useState(false); // Track loading state
    const [hasMore, setHasMore] = useState(true); // To check if there are more posts

    // Fetch posts with cursor pagination
    const { data, fetchMore } = useQuery(GET_POSTS, {
        variables: { limit: 5, cursor },
        skip: !showPosts, // Skip query if posts are not visible
        onCompleted: (data) => {
            if (data?.getPosts) {
                setPosts((prevPosts) => [...prevPosts, ...data.getPosts.posts]);
                setHasMore(data.getPosts.hasMore);
                setLoading(false);
            }
        },
    });

    // Function to handle "View Blog" button click
    const handleViewBlogClick = () => {
        setShowPosts(!showPosts);
        if (!showPosts) {
            // Trigger the first load if the user is opening the posts section
            loadMorePosts();
        }
    };

    // Function to load more posts when the user scrolls near the bottom
    const loadMorePosts = async () => {
        if (loading || !hasMore) return; // Avoid fetching if already loading or no more posts
        setLoading(true);
        try {
            await fetchMore({
                variables: {
                    limit: 5,
                    cursor: posts[posts.length - 1]?.createdAt, // Set the cursor to the last post's timestamp
                },
            });
        } catch (error) {
            console.error('Error loading more posts:', error);
            setLoading(false);
        }
    };

    // Scroll event listener to detect when user reaches the bottom
    const handleScroll = () => {
        const bottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight;
        if (bottom && hasMore) {
            loadMorePosts();
        }
    };

    // Add event listener for scroll events
    useEffect(() => {
        if (showPosts) {
            window.addEventListener('scroll', handleScroll);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showPosts, loading, hasMore]);

    return (
        <Grid columns={1} padded style={{ marginTop: '20px' }}>
            <Grid.Row>
                <Grid.Column width={16} textAlign="center">
                    <Header as="h1">Recent Posts</Header>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                {/* Show 'Add Post' Button only if the user is logged in, take full width */}
                {user && (
                    <Grid.Column width={16}>
                        <Segment padded="very" style={{ textAlign: 'center' }}>
                            <AddPost />
                        </Segment>
                    </Grid.Column>
                )}
            </Grid.Row>

            {/* View Blog Button below Add Post */}
            <Grid.Row>
                <Grid.Column width={16} textAlign="center">
                    <Button 
                        primary 
                        onClick={handleViewBlogClick} 
                        style={{ marginBottom: '20px' }}
                    >
                        {showPosts ? 'Hide Blog' : 'View Blog'}
                    </Button>
                </Grid.Column>
            </Grid.Row>

            {/* Show Posts only when 'View Blog' is clicked */}
            {showPosts && (
                <Grid.Row>
                    {/* If posts are loading, show a loader */}
                    {loading && posts.length === 0 ? (
                        <Grid.Column textAlign="center" width={16}>
                            <Loader active inline="centered" size="large" />
                        </Grid.Column>
                    ) : (
                        <Transition.Group>
                            {posts.map((post) => (
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }} width={16}>
                                    <Card post={post} />
                                </Grid.Column>
                            ))}
                        </Transition.Group>
                    )}

                    {/* Show loader when fetching more posts */}
                    {loading && posts.length > 0 && (
                        <Grid.Column width={16} textAlign="center">
                            <Loader active inline="centered" size="large" />
                        </Grid.Column>
                    )}

                    {/* Show "No more posts" message when there are no more posts */}
                    {!hasMore && posts.length > 0 && (
                        <Grid.Column width={16} textAlign="center">
                            <p>No more posts available.</p>
                        </Grid.Column>
                    )}
                </Grid.Row>
            )}
        </Grid>
    );
}

export default Home;
