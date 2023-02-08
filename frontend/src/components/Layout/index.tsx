import Header from 'components/header';
import { IUser } from 'global';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PagesStyle } from './style';

const Layout = () => {
	const navigate = useNavigate();
	const user: IUser = JSON.parse(localStorage.getItem('user'));

	React.useEffect(() => {
		if (!user) {
			return navigate('/');
		}
	}, [user]);

	return (
		<PagesStyle>
			<Header name={user?.name} />
			<div id="layout">{user ? <Outlet /> : null}</div>
		</PagesStyle>
	);
};

export default Layout;
