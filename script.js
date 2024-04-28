const PAGE_SIZE = 10;
        let filteredData = [];

        fetch("https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees")
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
                const data = response.data;
                filteredData = data.slice();
                let totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
                let currentPage = 1;


                function displayData(page) {
                    const tableBody = document.getElementById('employee-data');
                    tableBody.innerHTML = '';

                    const startIndex = (page - 1) * PAGE_SIZE;
                    const endIndex = startIndex + PAGE_SIZE;
                    const pageData = filteredData.slice(startIndex, endIndex);

                    pageData.forEach(function (employee, index) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                    <td>${startIndex + index + 1}</td> 
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.department}</td>
                    <td>${employee.salary}</td>
                `;
                        tableBody.appendChild(row);
                    });
                }

                function applyFilters() {
                    let departmentFilter = document.getElementById('department-filter').value;
                    let genderFilter = document.getElementById('gender-filter').value;
                    let sortBy = document.getElementById('sort-by').value;

                    filteredData = data.filter(employee => {
                        let match = true;
                        if (departmentFilter && employee.department !== departmentFilter) {
                            match = false;
                        }
                        if (genderFilter && employee.gender !== genderFilter) {
                            match = false;
                        }
                        return match;
                    });


                    if (sortBy === 'asc') {
                        filteredData.sort((a, b) => a.salary - b.salary);
                    } else if (sortBy === 'desc') {
                        filteredData.sort((a, b) => b.salary - a.salary);
                    }

                    totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
                    currentPage = 1;
                    displayData(currentPage);
                    updatePaginationButtons();
                }

                function updatePaginationButtons() {
                    const prevButton = document.getElementById("prev-page");
                    const nextButton = document.getElementById("next-page");
                    prevButton.disabled = currentPage === 1;
                    nextButton.disabled = currentPage === totalPages;
                }

                displayData(currentPage);
                updatePaginationButtons();

                document.getElementById("prev-page").addEventListener("click", () => {
                    if (currentPage > 1) {
                        currentPage--;
                        displayData(currentPage);
                        document.getElementById('page-info').innerHTML = 'Page ' + currentPage;
                        updatePaginationButtons();
                    }
                });

                document.getElementById("next-page").addEventListener("click", () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayData(currentPage);
                        document.getElementById('page-info').innerHTML = 'Page ' + currentPage;
                        updatePaginationButtons();
                    }
                });

                document.getElementById('department-filter').addEventListener('change', applyFilters);
                document.getElementById('gender-filter').addEventListener('change', applyFilters);
                document.getElementById('sort-by').addEventListener('change', applyFilters);
            });