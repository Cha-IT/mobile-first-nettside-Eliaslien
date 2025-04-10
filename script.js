fetch('meny.json')
  .then(response => response.json())
  .then(menu => {
    const menuList = document.getElementById("menu-list");
    menu.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="name">${item.name}</span>
        <span class="price">${item.price} NOK</span>
        <button class="add-to-order" data-name="${item.name}" data-price="${item.price}">Legg til</button>
      `;
      menuList.appendChild(li);
    });

    let order = JSON.parse(localStorage.getItem('order')) || [];
    const orderList = document.getElementById("order-list");

    function updateOrderList() {
      orderList.innerHTML = "";
      order.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="name">${item.name}</span>
          <span class="price">${item.price} NOK</span>
          <button class="remove-item" data-name="${item.name}" data-price="${item.price}">Fjern</button>
        `;
        orderList.appendChild(li);
      });
    }

    menuList.addEventListener("click", function(event) {
      if (event.target.classList.contains("add-to-order")) {
        const itemName = event.target.getAttribute("data-name");
        const itemPrice = event.target.getAttribute("data-price");
        const item = { name: itemName, price: parseFloat(itemPrice) };
        order.push(item);
        updateOrderList();
        saveOrder();
        showNotification(`${item.name} er lagt til i bestillingen.`);
      }
    });

    orderList.addEventListener("click", function(event) {
      if (event.target.classList.contains("remove-item")) {
        const itemName = event.target.getAttribute("data-name");
        const itemPrice = event.target.getAttribute("data-price");
        order = order.filter(item => item.name !== itemName || item.price !== parseFloat(itemPrice));
        updateOrderList();
        saveOrder();
      }
    });

    function showNotification(message) {
      const notification = document.getElementById("notification");
      notification.innerText = message;
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }

    const submitOrderButton = document.getElementById("submit-order");
    submitOrderButton.addEventListener("click", function() {
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;

      if (name && phone && order.length > 0) {
        
        showNotification("Bestillingen din er sendt!");
        order = [];
        updateOrderList();
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        saveOrder();
      } else {
        
        showNotification("Vennligst fyll ut navn, telefonnummer og legg til varer i bestillingen.");
      }
    });

    function saveOrder() {
      localStorage.setItem('order', JSON.stringify(order));
    }

    updateOrderList();
  })
  .catch(error => {
    console.error('Det oppstod en feil med å hente menyen:', error);
  });
