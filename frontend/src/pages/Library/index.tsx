import React from 'react';
import CardBook from '../../components/cardBook';
import ComeBack from '../../components/comeBack';
import Head from '../../components/head';
import { Ibooks } from '../../global';
import SearchIcon from '@mui/icons-material/Search';
import { getAllBooks } from '../../services/api';
import { LibraryStyles, TextFieldMui } from './style';
import BasicButtons from '../../components/button';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { filterBooks } from '../../util/filterBooks';
import Modal from '../../components/modal';
import { useParams } from 'react-router-dom';
import { useMessage } from '../../hooks/AlertMessage';

type TInputField = {
	name: string;
	value: string;
};

const inputField: TInputField[] = [
	{
		name: 'search',
		value: ''
	},
	{
		name: 'filter',
		value: ''
	}
];

const Library = () => {
	const { id } = useParams();
	const { setMessage, AlertMessage } = useMessage();

	const { showModal, handleClickModal } = Modal();

	const [books, setBooks] = React.useState<Ibooks[] | []>([]);
	const [copyBooks, setCopyBooks] = React.useState<Ibooks[] | []>([]);
	const [formSave, setformSave] = React.useState(
		inputField.reduce(
			(acc, field) => {
				return { ...acc, [field.name]: '' };
			},
			{ search: '', filter: '' }
		)
	);

	React.useEffect(() => {
		getAllBooks()
			.then(res => {
				setBooks(res);
				setCopyBooks(res);
			})
			.catch(error => {
				setMessage({
					content: error.response?.data ? error.response.data : error.message,
					display: true,
					severity: 'error'
				});
			});
	}, []);

	React.useEffect(() => {
		if (id) {
			handleClickModal(id);
		}
	}, []);

	const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		setformSave({ ...formSave, [target.name]: target.value });
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		filterBooks(formSave.search, formSave.filter, books, setCopyBooks);
	};

	return (
		<LibraryStyles>
			{AlertMessage()}
			<Head
				title="Biblioteca"
				content="private"
				description="A p??gina mostra todoa os livros que o usu??rio pode alugar."
			/>
			<ComeBack to="/home" value="Biblioteca" />
			<form className="box-component" onSubmit={handleSubmit}>
				<div className="box-search">
					<TextFieldMui
						InputProps={{ startAdornment: <SearchIcon sx={{ color: '#ADB5BD', marginRight: '5px' }} /> }}
						label=""
						name="search"
						placeholder="Pesquisar livro..."
						variant="outlined"
						autoComplete="off"
						value={formSave.search}
						onChange={handleChange}
					/>
					<BasicButtons
						width="82px"
						height="37px"
						fontSize="0.8rem"
						bordercolor="#FFC501"
						backgroundcolor="#FFC501"
						textcolor="black"
						type="submit"
					>
						Buscar
					</BasicButtons>
				</div>
				<FormControl id="filter" focused={false} sx={{ m: 1, minWidth: 170 }}>
					<InputLabel>Filtrar</InputLabel>
					<Select
						labelId="demo-simple-select-helper-label"
						name="filter"
						value={formSave.filter}
						label="Filtrar"
						onChange={handleChange}
					>
						<MenuItem value="">
							<em>Selecione</em>
						</MenuItem>
						<MenuItem value="genre">G??nero</MenuItem>
						<MenuItem value="author">Autor</MenuItem>
						<MenuItem value="systemEntryDate">Data de entrada</MenuItem>
					</Select>
				</FormControl>
			</form>

			<div id="box-books">
				<CardBook value={copyBooks} handleClickModal={handleClickModal} />
			</div>
			{showModal()}
		</LibraryStyles>
	);
};

export default Library;
