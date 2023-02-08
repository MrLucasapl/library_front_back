import React from 'react';
import Logo from 'assets/Logo.png';
import BasicButtons from 'components/button';
import { useNavigate } from 'react-router-dom';
import { BackgroundImg, BackgroundFilter, TextFieldMui } from './style';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './validation';
import { postUser } from 'services/api';
import { useMessage } from 'hooks/AlertMessage';

const Login = () => {
	const navigate = useNavigate();
	localStorage.removeItem('user');
	const { setMessage, AlertMessage } = useMessage();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values: { email: string; password: string; }) => {
			postUser(values.email, values.password)
				.then(res => {
					const { name, token, auth } = res;
					if (auth) {
						localStorage.setItem(
							'user',
							JSON.stringify({
								name,
								token
							})
						);
						return navigate('/home');
					}
				})
				.catch(error => {
					setMessage({
						content: error.response?.data ? error.response.data : error.message,
						display: true,
						severity: 'error'
					});
				});
		}
	});

	return (
		<BackgroundImg data-testid="login">
			<BackgroundFilter>
				{AlertMessage()}
				<form onSubmit={formik.handleSubmit}>
					<img id="logo" src={Logo} alt="imagem logo" />
					<section>
						<TextFieldMui
							type="email"
							label=""
							id="email"
							placeholder="E-mail"
							variant="outlined"
							autoComplete="on"
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
						/>
						<TextFieldMui
							type="password"
							label=""
							id="password"
							placeholder="Senha"
							variant="outlined"
							autoComplete="of"
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)}
						/>
					</section>
					<nav>
						<a href="###">Esqueci minha senha</a>
					</nav>
					<BasicButtons
						width="80%"
						fontSize="1rem"
						height="42px"
						bordercolor="#FFC501"
						backgroundcolor="#FFC501"
						textcolor="black"
						type="submit"
					>
						ENTRAR
					</BasicButtons>
				</form>
			</BackgroundFilter>
		</BackgroundImg>
	);
};

export default Login;
