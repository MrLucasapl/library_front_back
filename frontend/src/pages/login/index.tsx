import React from 'react';
import Logo from 'assets/Logo.png';
import BasicButtons from 'components/button';
import { useNavigate } from 'react-router-dom';
import { BackgroundImg, BackgroundFilter, TextFieldMui } from './style';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './validation';
import { postUser } from 'services/api';
//import { AlertCustomized } from 'components/alert';

const Login = () => {
	const navigate = useNavigate();
	localStorage.removeItem('user');

	//const [open, setOpen] = React.useState<boolean>(false);
	//const [state, setState] = React.useState<boolean>(false);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const response = postUser(values.email, values.password);
			response.then((res)=>{
				const { name, token, auth } = res;
				if(auth){
					localStorage.setItem('user', JSON.stringify({name, token}));
					return navigate('/home');	
				}
			});
		},
	});

	return (
		<BackgroundImg>
			<BackgroundFilter>
				{/* {<AlertCustomized open={open} state={state} setOpen={setOpen} message={'usuario ou senha incorreto!'}/>} */}
				<form onSubmit={formik.handleSubmit}>
					<img id='logo' src={Logo} alt='imagem logo' />
					<section>
						<TextFieldMui
							type='email'
							label=''
							id='email'
							placeholder='E-mail'
							variant='outlined'
							autoComplete='on'
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)} 
						/>
						<TextFieldMui 
							type='password'
							label=''
							id='password'
							placeholder='Senha'
							variant='outlined'
							autoComplete='of'
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)} 
						/>
					</section>
					<nav>
						<a href='###'>Esqueci minha senha</a>
					</nav>
					<BasicButtons
						width='80%'
						fontSize='1rem'
						height='42px'
						bordercolor='#FFC501'
						backgroundcolor='#FFC501'
						textcolor='black'
						type='submit'
					>
						ENTRAR
					</BasicButtons>
				</form>				
			</BackgroundFilter>
		</BackgroundImg>
	);
};

export default Login;
