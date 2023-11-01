document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://6542bebd01b5e279de1f8341.mockapi.io/users";

  const inputGet1Id = document.getElementById("inputGet1Id");
  const btnGet1 = document.getElementById("btnGet1");
  const inputPostNombre = document.getElementById("inputPostNombre");
  const inputPostApellido = document.getElementById("inputPostApellido");
  const btnPost = document.getElementById("btnPost");
  const inputPutId = document.getElementById("inputPutId");
  const btnPut = document.getElementById("btnPut");
  const inputDelete = document.getElementById("inputDelete");
  const btnDelete = document.getElementById("btnDelete");
  const results = document.getElementById("results");
  const alertError = document.getElementById("alert-error");
  const dataModal = document.getElementById("dataModal");
  const inputPutNombre = document.getElementById("inputPutNombre");
  const inputPutApellido = document.getElementById("inputPutApellido");
  const btnSendChanges = document.getElementById("btnSendChanges");

  // Función para mostrar una alerta con un mensaje
  function showAlert(message) {
    alertError.textContent = message;
    alertError.classList.remove("fade");
    setTimeout(() => {
      alertError.classList.add("fade");
    }, 2000);
  }

  // Función para obtener y mostrar la lista de registros
  function fetchAndDisplayList() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        results.innerHTML = "";
        data.forEach((record) => {
          const listItem = document.createElement("li");
          const idElement = document.createElement('p');
          idElement.textContent = `ID: ${record.id}`;
          idElement.classList.add('result-item');

          const nameElement = document.createElement('p');
          nameElement.textContent = `Nombre: ${record.name}`;
          nameElement.classList.add('result-item');

          const lastnameElement = document.createElement('p');
          lastnameElement.textContent = `Apellido: ${record.lastname}`;
          lastnameElement.classList.add('result-item');

          listItem.appendChild(idElement);
          listItem.appendChild(nameElement);
          listItem.appendChild(lastnameElement);

          results.appendChild(listItem);
        });
      })
      .catch((error) => showAlert('Error al obtener la lista de registros'));
  }

  // Evento para manejar el click del botón "Buscar"
  btnGet1.addEventListener("click", () => {
    const id = inputGet1Id.value;
    if (id) {
      fetch(`${apiUrl}/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Algo salió mal...");
          }
          return response.json();
        })
        .then((data) => {
          results.innerHTML = ""; // Limpia cualquier resultado anterior
          const idElement = document.createElement("p");
          idElement.textContent = `ID: ${data.id}`;
          idElement.classList.add("result-item");
  
          const nameElement = document.createElement("p");
          nameElement.textContent = `Nombre: ${data.name}`;
          nameElement.classList.add("result-item");
  
          const lastnameElement = document.createElement("p");
          lastnameElement.textContent = `Apellido: ${data.lastname}`;
          lastnameElement.classList.add("result-item");
  
          results.appendChild(idElement);
          results.appendChild(nameElement);
          results.appendChild(lastnameElement);
        })
        .catch((error) => showAlert(error.message));
    } else {
      fetchAndDisplayList();
    }
  });
  

  // Evento para manejar el click del botón "Agregar"
  btnPost.addEventListener("click", () => {
    const nombre = inputPostNombre.value;
    const apellido = inputPostApellido.value;
    if (nombre && apellido) {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nombre, lastname: apellido }),
      })
        .then((response) => response.json())
        .then(() => {
          inputPostNombre.value = "";
          inputPostApellido.value = "";
          fetchAndDisplayList();
        })
        .catch((error) => showAlert("Error al agregar el registro"));
    }
  });

 // Event listener "Modificar" button click
btnPut.addEventListener("click", () => {
    const id = inputPutId.value;
    if (id) {
      openEditModal(id);
    } else {
      showAlert("Por favor, ingresa un ID válido para modificar.");
    }
  });
  
  // Función para manejar el click del botón "Modificar"
  function openEditModal(id) {
    fetch(`${apiUrl}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Algo salió mal...");
        }
        return response.json();
      })
      .then((data) => {
        inputPutId.value = data.id;
        inputPutNombre.value = data.name;
        inputPutApellido.value = data.lastname;
  
        // abre el modal
        const myModal = new bootstrap.Modal(document.getElementById("dataModal"));
        myModal.show();
  
        btnSendChanges.disabled = false;
      })
      .catch((error) => showAlert(error.message));
  }
  

  // Evento para manejar el click del botón "Borrar"
  btnDelete.addEventListener("click", () => {
    const id = inputDelete.value;
    if (id) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Algo salió mal...");
          }
        })
        .then(() => {
          inputDelete.value = "";
          fetchAndDisplayList();
        })
        .catch((error) => showAlert(error.message)); // Muestra el mensaje de error
    }
  });

  // Evento para manejar el click del botón "Guardar" en el modal
  btnSendChanges.addEventListener("click", () => {
    const id = inputPutId.value;
    const nombre = inputPutNombre.value;
    const apellido = inputPutApellido.value;
    if (id && nombre && apellido) {
      fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nombre, lastname: apellido }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Algo salió mal...");
          }
        })
        .then(() => {
          dataModal.style.display = "none";
          fetchAndDisplayList();
        })
        .catch((error) => showAlert(error.message)); // Muestra el mensaje de error
    }
  });

  // Eventos para campos de entrada para activar/desactivar botones
  inputGet1Id.addEventListener("input", () => {
    btnGet1.disabled = !inputGet1Id.value;
  });
  inputPostNombre.addEventListener("input", () => {
    btnPost.disabled = !inputPostNombre.value || !inputPostApellido.value;
  });
  inputPostApellido.addEventListener("input", () => {
    btnPost.disabled = !inputPostNombre.value || !inputPostApellido.value;
  });
  inputPutId.addEventListener("input", () => {
    btnPut.disabled = !inputPutId.value;
  });
  inputDelete.addEventListener("input", () => {
    btnDelete.disabled = !inputDelete.value;
  });
  inputPutNombre.addEventListener("input", () => {
    btnSendChanges.disabled = !inputPutNombre.value || !inputPutApellido.value;
  });
  inputPutApellido.addEventListener("input", () => {
    btnSendChanges.disabled = !inputPutNombre.value || !inputPutApellido.value;
  });

  // Búsqueda inicial y visualización de registros
  fetchAndDisplayList();
});

  



