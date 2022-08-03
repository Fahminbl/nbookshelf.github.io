document.addEventListener('DOMContentLoaded', function() {
    confirm('Aplikasi berhasil dimuat, silahkan jelajahi fitur di dalamnya!');
    const submitForm = document.getElementById('submitBook');
    submitForm.addEventListener('click', function(event){
        event.preventDefault();
        addBook();
		clearInput();
    });
	const submitFormChange = document.getElementById('submitBookChange');
	submitFormChange.style.display = 'none';

	const searchButton = document.getElementById('searchSubmit');
	searchButton.addEventListener('click', function(event){
		event.preventDefault();
		searchYourBook();
		clearInput();
	});
		if (isStorageExist()){
		loadDataFromStorage();
	}
});
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_LIST';
let books = [];
const RENDER_EVENT = 'render-book';
const BOOK_ID = 'bookId';
const BOOK_INCOMPLETED_ID = "incompleteBookShelfList"
const BOOK_COMPLETED_ID = "completeBookShelfList"
const selesaiDibaca = document.getElementById('inputBookIsComplete');
selesaiDibaca.addEventListener('click', function() {
	if (selesaiDibaca.checked) {
		document.getElementById('submitStatus').innerText = 'Belum selesai dibaca';
		document.getElementById('submitStatus').innerText = 'selesai dibaca';
	} else {
		document.getElementById('submitStatus').innerText = 'Belum selesai dibaca';
		document.getElementById('submitStatus').innerText = 'Belum selesai dibaca';
	}
});
const editselesaiDibaca = document.getElementById('inputBookIsComplete');
editselesaiDibaca.addEventListener('click', function() {
	if (selesaiDibaca.checked) {
		document.getElementById('submitStatusChange').innerText = 'Belum selesai dibaca';
		document.getElementById('submitStatusChange').innerText = 'selesai dibaca';
	} else {
		document.getElementById('submitStatusChange').innerText = 'Belum selesai dibaca';
		document.getElementById('submitStatusChange').innerText = 'Belum selesai dibaca';
	}
});

function addBook() {
	const bookTitle = document.getElementById('inputBookTitle').value;
	const bookAuthor = document.getElementById('inputBookAuthor').value;
	const bookYear = document.getElementById('inputBookYear').value;
	const timeStamp = document.getElementById('inputBookDate').value;
	const incompleteBookShelfList = document.getElementById(BOOK_INCOMPLETED_ID);
	const completeBookshelfList = document.getElementById(BOOK_COMPLETED_ID);
	const selesaiDibaca = document.getElementById('inputBookIsComplete');
	if (!selesaiDibaca.checked) {
		const bookObject = generateBookObject(bookTitle, bookAuthor, bookYear, timeStamp, false);
		const bookShelfList = makeBookShelfList(bookTitle, bookAuthor, bookYear, timeStamp, false);
		bookShelfList[BOOK_ID] = bookObject.id;
		books.push(bookObject);
		incompleteBookShelfList.append(bookShelfList);
		alert('Buku ditambahkan ke rak atas');	
	} else {
		const bookObject = generateBookObject(bookTitle, bookAuthor, bookYear, timeStamp, true);
		const bookShelfList = makeBookShelfList(bookTitle, bookAuthor, bookYear, timeStamp, true);
		bookShelfList[BOOK_ID] = bookObject.id;
		books.push(bookObject);
		completeBookshelfList.append(bookShelfList);
		alert('Buku ditambahkan ke rak bawah');
	}
}

function clearInput(){
	document.getElementById('inputBookTitle').value = '';
	document.getElementById('inputBookAuthor').value = '';
	document.getElementById('inputBookYear').value = '';
	document.getElementById('inputBookDate').value = '';
	document.getElementById('inputBookIsComplete').checked = false;
	document.getElementById('searchBookTitle').value = '';
}

function generateBookObject(bookTitle, bookAuthor, bookYear, timeStamp, isComplete) {
	return {
		id: +new Date(),
		bookTitle,
		bookAuthor,
		bookYear,
		timeStamp,
		isComplete
	}
}

function makeBookShelfList(urTitle, urAuthor, urYear, urTimeStamp, isComplete) {
	const titleBook = document.createElement('h3');
	const title = document.createElement('span');
	title.classList.add('book_title');
	title.innerText = urTitle;
	titleBook.append(title);

	const authorBook = document.createElement('p');
	authorBook.innerText = 'Penulis : ';
	const author = document.createElement('span');
	author.classList.add('book_author');
	author.innerText = urAuthor;
	authorBook.append(author);

	const yearBook = document.createElement('p');
	yearBook.innerText = 'Tahun terbit : ';
	const year = document.createElement('span');
	year.classList.add('book_year');
	year.innerText = urYear;
	yearBook.append(year);

	const timeStampBook = document.createElement('p');
	timeStampBook.innerText = 'Target Selesai : ';
	const timestamp = document.createElement('span');
	timestamp.classList.add('book_timestamp');
	timestamp.innerText = urTimeStamp;
	timeStampBook.append(timestamp);

	const actionContainer = document.createElement('div');
	actionContainer.classList.add('action');

	const articleContainer = document.createElement('article');
	articleContainer.classList.add('book_item');
	articleContainer.append(titleBook, authorBook, yearBook, timeStampBook, actionContainer);

	if (isComplete) {
		actionContainer.append(
			generateUndoButton(),
			generateTrashButton(),
			generateChangeButton()
		);
	} else {
		actionContainer.append(
			generateCheckButton(),
			generateTrashButton(),
			generateChangeButton()
		)
	}
	return articleContainer;

}

function addButton(textButton, buttonTypeClass, eventListener) {
	const button = document.createElement('button');
	button.innerText = textButton;
	button.classList.add(buttonTypeClass);
	button.addEventListener('click', function(event) {
		eventListener(event);
	});
	return button;
}

function generateCheckButton() {
	return addButton('Selesai dibaca', 'green', function(event){
		const elder = event.target.parentElement;
		addBookToCompleted(elder.parentElement);
	});
}

function generateTrashButton() {
	return addButton('Hapus buku', 'red', function(event){
		const elder = event.target.parentElement;
		removeBook(elder.parentElement);
	});
}

function generateUndoButton() {
	return addButton('Belum selesai dibaca', 'yellow', function(event){
		const elder = event.target.parentElement;
		undoBookFromCompleted(elder.parentElement);
	});
}

function generateChangeButton() {
	return addButton('Edit buku', 'blue',function(event){
		const elder = event.target.parentElement;
		changeBookContent(elder.parentElement);
	})
}

function addBookToCompleted(booksElement){
	const title = booksElement.querySelector('.book_title').innerText;
	const author = booksElement.querySelector('.book_author').innerText;
	const year = booksElement.querySelector('.book_year').innerText;
	const timestamp = booksElement.querySelector('.book_timestamp').innerText;
	const newBookList = makeBookShelfList(title, author, year, timestamp, true);
	const completedList = document.getElementById(BOOK_COMPLETED_ID);
	const bookKu = findBook(booksElement[BOOK_ID]);
	bookKu.isComplete = true;
	newBookList[BOOK_ID] = bookKu.id;

	completedList.append(newBookList);
	booksElement.remove();
	alert('Anda telah memindahkan buku ke rak bawah');
}

function undoBookFromCompleted(booksElement){
	const title = booksElement.querySelector('.book_title').innerText;
	const author = booksElement.querySelector('.book_author').innerText;
	const year = booksElement.querySelector('.book_year').innerText;
	const timestamp = booksElement.querySelector('.book_timestamp').innerText;
	const newBookList = makeBookShelfList(title, author, year, timestamp, false);
	const incompletedList = document.getElementById(BOOK_INCOMPLETED_ID);
	const bookKu = findBook(booksElement[BOOK_ID]);
	bookKu.isComplete = false;
	newBookList[BOOK_ID] = bookKu.id;

	incompletedList.append(newBookList);
	booksElement.remove();
	alert('Anda Telah Memindahkan buku ke Rak Atas');
}

function removeBook(bookId){
	const yaqin = confirm('mau menghapus buku ini?');
	if (yaqin) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	const bookList = document.querySelector('.book_item');
	bookList.remove();
	alert('Anda telah menghapusku dari rak')
	} else {
		return null;
	}
}

function changeBookContent(booksElement) {
	const yaqin = confirm('anda yakin ingin mengedit buku ini?');
	if (yaqin) {
	const changeButton = document.getElementById('submitBookChange');
	changeButton.style.display = 'block';
	document.getElementById('inputBookTitle').value = booksElement.querySelector('.book_title').innerText;
	document.getElementById('inputBookAuthor').value = booksElement.querySelector('.book_author').innerText;
	document.getElementById('inputBookYear').value = booksElement.querySelector('.book_year').innerText;
	document.getElementById('inputBookDate').value = booksElement.querySelector('.book_timestamp').innerText;
	document.getElementById('submitBook').style.display = 'none';
	booksElement.remove();
	alert('buku dikembalikan ke menu input');
	changeButton.addEventListener('click', function(event){
		event.preventDefault();
		addChangedBook();
	});
} else {
	return null;
}
}

function addChangedBook(){
	const yaqin = confirm('simpan perubahan ini?');
	const submitBook = document.getElementById('submitBook');
	const submitBookChange = document.getElementById('submitBookChange');
	if (yaqin){
	addBook();
	clearInput();
	submitBookChange.style.display = 'none';
	submitBook.style.display = 'block'
	} else {
	return null;
	}
}


function findBookIndex(bookId) {
	for (let index in books) {
		if (books[index].id === bookId) {
			return index;
		}
		index++;
	}
}

function findBook(bookId) {
	for (let bookItem of books) {
		if (bookItem.id === bookId){
			return bookItem;
		}
	}
	return null;
}

function searchYourBook(){
	var input, filter, bookShelf, bookItem, title, i, txtValue;
	input = document.getElementById('searchBookTitle');
	filter = input.value.toUpperCase();
	bookShelf = document.getElementsByClassName('book_list');
	bookItem = document.getElementsByClassName('book_item');

	for (i = 0; i < bookItem.length; i++) {
		title = bookItem[i].getElementsByClassName('book_title')[0];
		txtValue = title.textContent || title.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1 ) {
			bookItem[i].style.display = "";
		} else {
			bookItem[i].style.display = "none";
		}
	}
	alert('pencarian selesai');
}

function isStorageExist(){
	if (typeof (Storage) === undefined) {
			alert('Browser kamu tidak mendukung local storage');
			return false;
		}
		return true
}

function loadDataFromStorage(){
	const serializedBook = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedBook);
	if (data !== null) {
		for(const book of books) {
			books.push(book);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}