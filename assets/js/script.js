const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");

inputSearchBook.addEventListener("keyup", (e) => {
   e.preventDefault();
   searchBooks();
});

document.addEventListener(RENDER_EVENT, () => {
   const btnResetRak = document.getElementById("resetRak");
   if (books.length <= 0) {
      btnResetRak.style.display = "none";
   } else {
      btnResetRak.style.display = "block";
   }
   showBook(books);
});

document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();
      form.reset();
   });
   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

function isStorageExist() {
   if (typeof Storage === "undefined") {
      swal("Sorry", "Maaf, Browser anda tidak mendukung web storage.", "info");
      return false;
   }
   return true;
}

const generateId = () => +new Date();

function checkStatusBook() {
   const isCheckComplete = document.getElementById("bookIsComplete");
   if (isCheckComplete.checked) {
      return true;
   }
   return false;
}

function addBook() {
   const bookTitle = document.getElementById("bookTitle").value;
   const bookAuthor = document.getElementById("bookAuthor").value;
   const bookYear = document.getElementById("bookYear").value;
   const isCompleted = checkStatusBook();

   const id = generateId();
   const newBook = generateBookItem(id, bookTitle, bookAuthor, bookYear, isCompleted);

   books.unshift(newBook);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();

   swal("Berhasil", "Buku baru sudah ditambahkan kedalam rak", "success");
}

const generateBookItem = (id, title, author, year, isCompleted) => {
   return {
      id,
      title,
      author,
      year,
      isCompleted,
   };
};

function findBookIndex(bookId) {
   for (const index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }
   return null;
}

function removeBook(bookId) {
   const bookTarget = findBookIndex(bookId);
   swal({
      title: "Apakah Anda Yakin?",
      text: "Buku akan dihapus, Buku yang dihapus tidak akan bisa kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(bookTarget, 1);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Buku yand dipilih sudah dihapus dari rak", "success");
      } else {
         swal("Buku tidak jadi dihapus");
      }
   });
}

function resetRak() {
   swal({
      title: "Apakah Anda Yakin?",
      text: "Semua buku akan dihapus dari rak, Buku yang dihapus tidak akan bisa kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(0, books.length);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Semua buku sudah dihapus dari rak", "success");
      } else {
         swal("Rak batal dikosongkan");
      }
   });
}

function changeBookStatus(bookId) {
   const bookIndex = findBookIndex(bookId);
   for (const index in books) {
      if (index === bookIndex) {
         if (books[index].isCompleted === true) {
            books[index].isCompleted = false;
            swal("Berhasil", "Buku sudah berpindah ke rak belum selesai dibaca", "success");
         } else {
            books[index].isCompleted = true;
            swal("Berhasil", "Buku sudah berpindah ke rak selesai dibaca", "success");
         }
      }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function searchBooks() {
   const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");
   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";
   if (inputSearchValue == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
      return;
   }
   for (const book of books) {
      if (book.title.toLowerCase().includes(inputSearchValue)) {
         if (book.isCompleted == false) {
            let element = `
            <article class="book_list">
               <h2 class="book-title">${book.title}</h2>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="completed-read" onclick="changeBookStatus(${book.id})">Selesai dibaca</button>
                  <button class="completed-read" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="completed-read" onclick="editBookData(${book.id})">Edit buku</button>
               </div>
            </article>
            `;

            incompleteBookShelf.innerHTML += element;
         } else {
            let element = `
            <article class="book_list">
               <h2 class="book-title">${book.title}</h2>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="uncompleted-read" onclick="changeBookStatus(${book.id})">Belum selesai dibaca</button>
                  <button class="uncompleted-read" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="uncompleted-read" onclick="editBookData(${book.id})">Edit buku</button>
               </div>
            </article>
            `;

            completeBookShelf.innerHTML += element;
         }
      }
   }
}

function editBookData(bookId) {
   const sectionEdit = document.querySelector(".edit_section");
   sectionEdit.style.display = "flex";
   const editTitle = document.getElementById("editTitle");
   const editAuthor = document.getElementById("editAuthor");
   const editYear = document.getElementById("editYear");
   const formEditData = document.getElementById("editData");
   const cancelEdit = document.getElementById("bookEditCancel");
   const SubmitEdit = document.getElementById("bookEditSubmit");
   bookTarget = findBookIndex(bookId);   
   editTitle.setAttribute("value", books[bookTarget].title);
   editAuthor.setAttribute("value", books[bookTarget].author);
   editYear.setAttribute("value", books[bookTarget].year);
   SubmitEdit.addEventListener("click", (e) => {
      books[bookTarget].title = editTitle.value;
      books[bookTarget].author = editAuthor.value;
      books[bookTarget].year = editYear.value;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      formEditData.reset();
      sectionEdit.style.display = "none";
      swal("Berhasil", "Data bukumu sudah berhasil diedit", "success");
   });

   cancelEdit.addEventListener("click", (e) => {
      e.preventDefault();
      sectionEdit.style.display = "none";
      formEditData.reset();
      swal("Anda membatalkan untuk mengedit data buku");
   });
}

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);

      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      data.forEach((book) => {
         books.unshift(book);
      });
   }
   document.dispatchEvent(new Event(RENDER_EVENT));
   return books;
}

function showBook(books = []) {
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");

   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";

   books.forEach((book) => {
      if (book.isCompleted == false) {
         let element = `
            <article class="book_list">
               <h2 class="book-title">${book.title}</h2>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>                              
               <div class="action">
                  <button class="completed-read" onclick="changeBookStatus(${book.id})">Selesai dibaca</button>
                  <button class="completed-read" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="completed-read" onclick="editBookData(${book.id})">Edit buku</button>
               </div>
            </article>
            `;

         incompleteBookShelf.innerHTML += element;
      } else {
         let element = `
            <article class="book_list">
               <h2 class="book-title">${book.title}</h2>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>
               <div class="action">
                  <button class="uncompleted-read" onclick="changeBookStatus(${book.id})">Belum selesai dibaca</button>
                  <button class="uncompleted-read" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="uncompleted-read" onclick="editBookData(${book.id})">Edit buku</button>
               </div>
            </article>
            `;

         completeBookShelf.innerHTML += element;
      }
   });
}

