(function () {
  const tableData = innerText => {
    const trData = document.createElement('td');
    trData.innerText = innerText;
    return trData;
  };

  const htmlTableRow = row => {
    const { timeStamp, name, comment } = row;
    const trow = document.createElement('tr');
    trow.append(tableData(timeStamp));
    trow.append(tableData(name));
    trow.append(tableData(comment));
    return trow;
  };

  const commentList = xhr => {
    const comments = JSON.parse(xhr.response);
    const tbody = document.createElement('tbody');
    const table = document.querySelector('table');

    comments.forEach(comment => tbody.append(htmlTableRow(comment)));
    table.replaceChild(tbody, table.children[1]);
    return;
  };

  const parseFormData = formData => new URLSearchParams(formData);

  const addComment = () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);
    const body = parseFormData(formData);

    const xhr = new XMLHttpRequest();
    xhr.onload = event => {
      if (xhr.status === 200) {
        commentList(xhr)
      } else {
        console.log('Unable to load page');
      }
    };
    xhr.open('POST', '/guestbook');
    xhr.send(body);
    form.reset();
  };

  const main = () => {
    const button = document.querySelector('#submit');
    button.onclick = addComment;
  };

  window.onload = main;
})();