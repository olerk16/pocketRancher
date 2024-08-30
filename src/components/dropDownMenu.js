// // src/components/DropdownMenu.js

// export default class DropdownMenu {
//     constructor(scene, menuItems) {
//         this.scene = scene;
//         this.menuItems = menuItems;
//         this.createMenu();
//     }

//     createMenu() {
//         const dropdownContainer = document.createElement('div');
//         dropdownContainer.className = 'dropdown';
//         dropdownContainer.style.position = 'absolute';
//         dropdownContainer.style.top = '10px';
//         dropdownContainer.style.right = '10px';
//         dropdownContainer.style.zIndex = '1000';

//         const button = document.createElement('button');
//         button.className = 'btn btn-primary dropdown-toggle';
//         button.type = 'button';
//         button.id = 'dropdownMenuButton';
//         button.setAttribute('data-toggle', 'dropdown');
//         button.innerText = 'Actions';

//         const menu = document.createElement('div');
//         menu.className = 'dropdown-menu';
//         menu.setAttribute('aria-labelledby', 'dropdownMenuButton');

//         this.menuItems.forEach(item => {
//             this.addMenuItem(menu, item.text, item.onClick);
//         });

//         dropdownContainer.appendChild(button);
//         dropdownContainer.appendChild(menu);

//         document.getElementById('game-container').appendChild(dropdownContainer);
//     }

//     addMenuItem(menu, text, onClick) {
//         const item = document.createElement('a');
//         item.className = 'dropdown-item';
//         item.href = '#';
//         item.innerText = text;
//         item.addEventListener('click', (event) => {
//             event.preventDefault();
//             onClick();
//         });
//         menu.appendChild(item);
//     }

//     // Method to disable all menu options
//   disableMenu() {
//     this.menuItems.forEach(item => {
//       item.disableInteractive();
//     });
//   }

//   // Method to enable all menu options
//   enableMenu() {
//     this.menuItems.forEach(item => {
//       item.setInteractive();
//     });
//   }

//     removeMenu() {
//         const dropdown = document.querySelector('.dropdown');
//         if (dropdown) {
//             dropdown.remove();
//         }
//     }
// }

export default class DropdownMenu {
    constructor(scene, menuItems) {
        this.scene = scene;
        this.menuItems = menuItems;
        this.menuElements = []; // Store references to menu items
        this.createMenu();
    }

    createMenu() {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown';
        dropdownContainer.style.position = 'absolute';
        dropdownContainer.style.top = '10px';
        dropdownContainer.style.right = '10px';
        dropdownContainer.style.zIndex = '1000';

        const button = document.createElement('button');
        button.className = 'btn btn-primary dropdown-toggle';
        button.type = 'button';
        button.id = 'dropdownMenuButton';
        button.setAttribute('data-toggle', 'dropdown');
        button.innerText = 'Actions';

        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.setAttribute('aria-labelledby', 'dropdownMenuButton');

        this.menuItems.forEach(item => {
            const menuItem = this.addMenuItem(menu, item.text, item.onClick);
            this.menuElements.push(menuItem); // Store the element reference
        });

        dropdownContainer.appendChild(button);
        dropdownContainer.appendChild(menu);

        document.getElementById('game-container').appendChild(dropdownContainer);
    }

    addMenuItem(menu, text, onClick) {
        const item = document.createElement('a');
        item.className = 'dropdown-item';
        item.href = '#';
        item.innerText = text;
        item.addEventListener('click', (event) => {
            event.preventDefault();
            onClick();
        });
        menu.appendChild(item);
        return item; // Return the created item
    }

    // Method to disable all menu options
    disableMenu() {
        this.menuElements.forEach(item => {
            item.classList.add('disabled'); // Add disabled class
            item.style.pointerEvents = 'none'; // Disable pointer events
        });
    }

    // Method to enable all menu options
    enableMenu() {
        this.menuElements.forEach(item => {
            item.classList.remove('disabled'); // Remove disabled class
            item.style.pointerEvents = 'auto'; // Enable pointer events
        });
    }

    removeMenu() {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }
}

