const accountForm = document.getElementById("accountForm");
        const accountTable = document.getElementById("accountTable");

        const totalAccounts = document.getElementById("totalAccounts");
        const totalBalance = document.getElementById("totalBalance");

        const searchInput = document.getElementById("search");
        const formTitle = document.getElementById("formTitle");
        const submitBtn = document.getElementById("submitBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        // Load saved accounts
        let accounts = JSON.parse(
            localStorage.getItem("bankAccounts") || "[]"
        );

        let editingId = null;

        // SAVE ACCOUNTS
        function saveAccounts() {

            localStorage.setItem(
                "bankAccounts",
                JSON.stringify(accounts)
            );

        }

        // CREATE AND UPDATE
        accountForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const account = {

                accountNumber: document.getElementById("accountNumber").value.trim(),

                customerName: document.getElementById("customerName").value.trim(),

                email: document.getElementById("email").value.trim(),

                phone: document.getElementById("phone").value.trim(),

                accountType: document.getElementById("accountType").value,

                balance: Number(document.getElementById("balance").value)

            };

            if (!Number.isFinite(account.balance) || account.balance < 0) {
                alert("Please enter a valid balance.");
                return;
            }

            // Check duplicate account number or email
            const duplicate = accounts.some(item =>
                item.id !== editingId &&
                (
                    item.accountNumber === account.accountNumber ||
                    item.email.toLowerCase() === account.email.toLowerCase()
                )
            );

            if (duplicate) {
                alert("Account number or email already exists!");
                return;
            }

            if (editingId !== null) {

                // UPDATE
                accounts = accounts.map(item =>
                    item.id === editingId
                        ? { ...account, id: editingId }
                        : item
                );

                alert("Account updated successfully!");

            } else {

                // CREATE
                account.id = Date.now().toString();

                accounts.push(account);

                alert("Account created successfully!");

            }

            saveAccounts();
            displayAccounts();
            resetForm();

        });


        // READ AND DISPLAY ACCOUNTS
        function displayAccounts() {

            const searchValue = searchInput.value.toLowerCase();

            const filteredAccounts = accounts.filter(account =>

                account.customerName.toLowerCase().includes(searchValue) ||

                account.accountNumber.toLowerCase().includes(searchValue)

            );

            accountTable.innerHTML = "";

            if (filteredAccounts.length === 0) {

                accountTable.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty">
                            No accounts found
                        </td>
                    </tr>
                `;

            }

            filteredAccounts.forEach(account => {

                const row = document.createElement("tr");

                const values = [
                    account.accountNumber,
                    account.customerName,
                    account.email,
                    account.phone,
                    account.accountType,
                    "₹" + Number(account.balance).toLocaleString("en-IN")
                ];

                values.forEach(value => {

                    const cell = document.createElement("td");

                    cell.textContent = value;

                    row.appendChild(cell);

                });

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");

                editButton.textContent = "Edit";

                editButton.className = "edit-btn";

                editButton.addEventListener("click", () => {
                    editAccount(account.id);
                });

                const deleteButton = document.createElement("button");

                deleteButton.textContent = "Delete";

                deleteButton.className = "delete-btn";

                deleteButton.addEventListener("click", () => {
                    deleteAccount(account.id);
                });

                actionCell.append(editButton, deleteButton);

                row.appendChild(actionCell);

                accountTable.appendChild(row);

            });

            // Update dashboard statistics
            totalAccounts.textContent = accounts.length;

            const sum = accounts.reduce(
                (total, account) => total + Number(account.balance),
                0
            );

            totalBalance.textContent =
                "₹" + sum.toLocaleString("en-IN");

        }


        // EDIT ACCOUNT
        function editAccount(id) {

            const account = accounts.find(item => item.id === id);

            if (!account) return;

            editingId = id;

            document.getElementById("accountNumber").value = account.accountNumber;

            document.getElementById("customerName").value = account.customerName;

            document.getElementById("email").value = account.email;

            document.getElementById("phone").value = account.phone;

            document.getElementById("accountType").value = account.accountType;

            document.getElementById("balance").value = account.balance;

            formTitle.textContent = "Update Bank Account";

            submitBtn.textContent = "Update Account";

            cancelBtn.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        // DELETE ACCOUNT
        function deleteAccount(id) {

            const confirmDelete = confirm(
                "Are you sure you want to delete this account?"
            );

            if (!confirmDelete) return;

            accounts = accounts.filter(item => item.id !== id);

            saveAccounts();

            displayAccounts();

            if (editingId === id) {
                resetForm();
            }

            alert("Account deleted successfully!");

        }


        // RESET FORM
        function resetForm() {

            accountForm.reset();

            editingId = null;

            formTitle.textContent = "Create Bank Account";

            submitBtn.textContent = "Add Account";

            cancelBtn.hidden = true;

        }


        // CANCEL EDIT
        cancelBtn.addEventListener("click", resetForm);


        // SEARCH
        searchInput.addEventListener("input", displayAccounts);


        // INITIAL DISPLAY
        displayAccounts();
