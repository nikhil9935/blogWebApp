import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container, Icon } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

export default function MenuBar() {
    const pathname = window.location.pathname;
    const { user, logout } = useContext(AuthContext);
    
    // Determine the active menu item based on the current pathname
    const path = pathname === '/' ? 'home' : pathname.substring(1);
    
    const [activeItem, setActiveItem] = useState(path);
    
    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <Menu pointing secondary size="large" color="teal" style={{ borderRadius: '0px' }}>
                <Container>
                    {/* Logo or Brand Name (Optional) */}
                    <Menu.Item as={Link} to="/" header>
                        <Icon name="home" size="large" style={{ marginRight: '0.5rem' }} />
                        MyApp
                    </Menu.Item>

                    {/* If the user is logged in */}
                    {user ? (
                        <>
                            <Menu.Item
                                name={user?.username}
                                active={true}
                                as={Link}
                                to="/"
                            />
                            
                            <Menu.Menu position="right">
                                <Menu.Item
                                    name="logout"
                                    active={activeItem === 'logout'}
                                    onClick={logout}
                                    as={Link}
                                    to="/login"
                                />
                            </Menu.Menu>
                        </>
                    ) : (
                        /* If the user is not logged in */
                        <>
                            <Menu.Item
                                name="home"
                                active={activeItem === 'home'}
                                onClick={handleItemClick}
                                as={Link}
                                to="/"
                            />
                            
                            <Menu.Menu position="right">
                                <Menu.Item
                                    name="login"
                                    active={activeItem === 'login'}
                                    onClick={handleItemClick}
                                    as={Link}
                                    to="/login"
                                />
                                <Menu.Item
                                    name="register"
                                    active={activeItem === 'register'}
                                    onClick={handleItemClick}
                                    as={Link}
                                    to="/register"
                                />
                            </Menu.Menu>
                        </>
                    )}
                </Container>
            </Menu>
        </div>
    );
}
