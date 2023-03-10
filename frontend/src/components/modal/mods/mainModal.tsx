import React from 'react';
import { getBookId, putBookId } from '../../../services/api';
import { Ibooks, IrentHistory, MainModalProps } from '../../../global';
import { convertDate } from '../../../util/convertDate';
import BasicButtons from '../../button';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router-dom';
import { checkBorrowedBook } from '../../../util/convertDate';
import CloseModal from '../closeModal';
import { useMessage } from '../../../hooks/AlertMessage';

const MainModal = ({ bookId, handleChangeModal, handleClose }: MainModalProps) => {
	const { setMessage, AlertMessage } = useMessage();
	const [book, setBook] = React.useState<Ibooks>();
	const [isActive, setIsActive] = React.useState(true);
	const [loanBooks, setloanBooks] = React.useState<IrentHistory[]>();
	const [borrowed, setBorrowed] = React.useState<IrentHistory>();
	const navigate = useNavigate();

	React.useEffect(() => {
		getBookId(bookId)
			.then(res => {
				setBook(res);
				setloanBooks(res.rentHistory);
				setIsActive(res.status.isActive);
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
		if (book && loanBooks && isActive == true) {
			const bookloan = checkBorrowedBook(loanBooks);
			setBorrowed(bookloan);
		}
	}, [book]);

	const ReturnBook = () => {
		if (borrowed) {
			const rentHistory = {
				...borrowed,
				deliveryDate: new Date().toISOString().split('T')[0]
			};
			loanBooks.filter((loan, index) => {
				if (loan.studentName == borrowed.studentName && loan.class == borrowed.class) {
					book.rentHistory[index] = rentHistory;
					putBookId(bookId, book)
						.then(res => {
							setMessage({
								content: res.message,
								display: true,
								severity: 'success'
							});
						})
						.catch(error => {
							setMessage({
								content: error.response?.data ? error.response.data : error.message,
								display: true,
								severity: 'error'
							});
						});
					handleClose();
				}
			});
		}
	};

	const ActivateBook = () => {
		const newStatus = {
			description: '',
			isActive: true
		};
		book.status = newStatus;
		putBookId(bookId, book)
			.then(res => {
				setMessage({
					content: res.message,
					display: true,
					severity: 'success'
				});
			})
			.catch(error => {
				setMessage({
					content: error.response?.data ? error.response.data : error.message,
					display: true,
					severity: 'error'
				});
			});
		setIsActive(true);
	};

	if (typeof book === 'object' && book !== null && 'title' in book) {
		return (
			<React.Fragment>
				{AlertMessage()}
				<CloseModal onClick={handleClose} />
				<div className="box-content">
					<img src={`http://localhost:4002/upload/${book.image}`} alt="imagem do livro" />
					<div className="box-info">
						<div className="box-field">
							<h1>{book.title}</h1>
						</div>
						<div className="box-field">
							<strong>Sinopse</strong>
							<p id="synopsis">{book.synopsis}</p>
						</div>
						<div className="box-field">
							<strong>Autor</strong>
							<p>{book.author}</p>
						</div>
						<div className="box-field">
							<strong>G??nero</strong>
							<p>{book.genre}</p>
						</div>
						<div className="box-field">
							<strong>Data de entrada</strong>
							<p>{convertDate(book.systemEntryDate)}</p>
						</div>
					</div>
				</div>
				<div className="box-button">
					<BasicButtons
						className={borrowed ? '.active' : ''}
						disabled={!isActive}
						width="272px"
						height="53px"
						bordercolor="#ADB5BD"
						backgroundcolor="#FFC501"
						type="button"
						fontSize="0.9rem"
						textcolor="#000000"
						onClick={() => {
							if (borrowed) {
								return ReturnBook();
							} else {
								return handleChangeModal('main', 'lent');
							}
						}}
					>
						<AutoStoriesIcon sx={{ fontSize: '2.3rem', padding: '0px 8px' }} /> {borrowed ? 'Devolver' : 'Emprestar'}
					</BasicButtons>

					<div className="box-alternative">
						<BasicButtons
							width="101px"
							height="53px"
							bordercolor="#167CE2"
							backgroundcolor="#FFFFFF"
							type="button"
							fontSize="0.9rem"
							textcolor="#167CE2"
							onClick={() => navigate(`/home/addbook/${bookId}`)}
						>
							Editar
						</BasicButtons>

						<BasicButtons
							width="101px"
							height="53px"
							bordercolor={isActive ? '#ED5E5E' : '#49D749'}
							backgroundcolor="#FFFFFF"
							type="button"
							fontSize="0.9rem"
							textcolor={isActive ? '#ED5E5E' : '#49D749'}
							onClick={() => {
								if (!isActive) {
									return ActivateBook();
								} else {
									return handleChangeModal('main', 'inactive');
								}
							}}
						>
							{isActive ? 'Inativar' : 'Ativar'}
						</BasicButtons>

						<BasicButtons
							width="101px"
							height="53px"
							bordercolor="#ADB5BD"
							backgroundcolor="#FFFFFF"
							type="button"
							fontSize="0.9rem"
							textcolor="#000000"
							onClick={() => handleChangeModal('main', 'rentHistory')}
						>
							Hist??rico
						</BasicButtons>
					</div>
				</div>

				{borrowed && (
					<div className="box-LoanBook">
						<h1>Dados do aluno</h1>
						<div className="box-fild-loan">
							<div className="fild">
								<strong>Nome do aluno</strong>
								<p>{borrowed.studentName}</p>
							</div>
							<div className="fild">
								<strong>Turma</strong>
								<p>{borrowed.class}</p>
							</div>
							<div className="fild">
								<strong>Data da retirada</strong>
								<p>{convertDate(borrowed.withdrawalDate)}</p>
							</div>
							<div className="fild">
								<strong>Data da entrega</strong>
								<p>{convertDate(borrowed.deliveryDate)}</p>
							</div>
						</div>
					</div>
				)}

				{isActive == false && (
					<div className="box-LoanBook">
						<h1>Informa????es da inativa????o</h1>
						<div className="box-fild-loan">
							<div className="fild-inactivad">
								<strong>Motivo</strong>
								<p>{book.status.description}</p>
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}

	return <h1>Erro na requisi????o tente mais tarde</h1>;
};

export default MainModal;
