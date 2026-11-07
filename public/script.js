document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INSERT STUDENT (insert.html)
    const insertForm = document.getElementById("insertForm");
    if (insertForm) {
        insertForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const payload = {
                sno: document.getElementById("sno").value,
                name: document.getElementById("name").value,
                studentClass: document.getElementById("studentClass").value,
                total: document.getElementById("total").value,
                age: document.getElementById("age").value,
                phnno: document.getElementById("phnno").value
            };

            try {
                const response = await fetch("/std", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                
                const message = await response.text();
                alert(message);
                if (response.ok) insertForm.reset();
            } catch (err) {
                console.error("Insert error:", err);
            }
        });
    }

    // 2. LIST ALL STUDENTS (list.html)
    const studentTable = document.getElementById("studentList");
    if (studentTable) {
        fetch("/std")
            .then(res => res.json())
            .then(data => {
                studentTable.innerHTML = data.map(std => `
                    <tr>
                        <td>${std.student_id}</td>
                        <td>${std.student_name}</td>
                        <td>${std.class}</td>
                        <td>${std.total}</td>
                        <td>${std.age}</td>
                        <td>${std.phnno}</td>
                    </tr>
                `).join("");
            })
            .catch(err => console.error("Fetch list error:", err));
    }

    // 3. LOAD ONE / PREVIEW STUDENT (listone.html, update.html, delete.html)
    const loadBtn = document.getElementById("loadStudentBtn");
    if (loadBtn) {
        loadBtn.addEventListener("click", async () => {
            const sno = document.getElementById("sno").value;
            if (!sno) return alert("Please enter a Roll Number (student_id)");

            try {
                const response = await fetch(`/std/${sno}`);
                const data = await response.json();
                
                // Since your server returns an array from mysql8, handle index [0]
                const student = Array.isArray(data) ? data[0] : data;

                if (student) {
                    // Fill update form fields if they exist
                    if (document.getElementById("name")) document.getElementById("name").value = student.student_name || "";
                    if (document.getElementById("studentClass")) document.getElementById("studentClass").value = student.class || "";
                    if (document.getElementById("total")) document.getElementById("total").value = student.total || "";
                    if (document.getElementById("age")) document.getElementById("age").value = student.age || "";
                    if (document.getElementById("phnno")) document.getElementById("phnno").value = student.phnno || "";

                    // Render preview card if singleStudent container exists
                    const singleStudentDiv = document.getElementById("singleStudent");
                    if (singleStudentDiv) {
                        singleStudentDiv.innerHTML = `
                            <div class="panel" style="margin-top: 15px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                                <p><strong>Roll No:</strong> ${student.student_id}</p>
                                <p><strong>Name:</strong> ${student.student_name}</p>
                                <p><strong>Class:</strong> ${student.class}</p>
                                <p><strong>Total Marks:</strong> ${student.total}</p>
                                <p><strong>Age:</strong> ${student.age}</p>
                                <p><strong>Phone:</strong> ${student.phnno}</p>
                            </div>
                        `;
                    }
                } else {
                    alert("Student not found");
                }
            } catch (err) {
                console.error("Load one error:", err);
            }
        });
    }

    // 4. UPDATE STUDENT (update.html)
    const updateForm = document.getElementById("updateForm");
    if (updateForm) {
        updateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const sno = document.getElementById("sno").value;
            
            const payload = {
                name: document.getElementById("name").value,
                studentClass: document.getElementById("studentClass").value,
                total: document.getElementById("total").value,
                age: document.getElementById("age").value,
                phnno: document.getElementById("phnno").value
            };

            try {
                const response = await fetch(`/std/${sno}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                
                const message = await response.text();
                alert(message);
            } catch (err) {
                console.error("Update error:", err);
            }
        });
    }

    // 5. DELETE STUDENT (delete.html)
    const deleteForm = document.getElementById("deleteForm");
    if (deleteForm) {
        deleteForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const sno = document.getElementById("sno").value;
            if (!sno) return alert("Please enter a Roll Number to delete.");

            if (!confirm(`Are you sure you want to delete student ID ${sno}?`)) return;

            try {
                const response = await fetch(`/std/${sno}`, {
                    method: "DELETE"
                });
                
                const message = await response.text();
                alert(message);
                if (response.ok) window.location.reload();
            } catch (err) {
                console.error("Delete error:", err);
            }
        });
    }
});