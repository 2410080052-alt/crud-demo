document.addEventListener('DOMContentLoaded', () => {
      const studentForm = document.getElementById('student-form');
      const studentTableBody = document.getElementById('student-table-body');
      const saveBtn = document.getElementById('save-btn');
      const studentIdInput = document.getElementById('student-id');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const courseInput = document.getElementById('course');
      const gradeInput = document.getElementById('grade');

                              async function fetchStudents() {
                                        const { data, error } = await _supabase
                                            .from('students')
                                            .select('*')
                                            .order('created_at', { ascending: false });

          if (error) {
                        console.error('Error fetching students:', error);
                        return;
          }

          renderStudents(data);
                              }

                              function renderStudents(students) {
                                        studentTableBody.innerHTML = '';
                                        students.forEach(student => {
                                                      const tr = document.createElement('tr');
                                                      tr.innerHTML = `
                                                                      <td>${student.name}</td>
                                                                                      <td>${student.email}</td>
                                                                                                      <td>${student.course}</td>
                                                                                                                      <td>${student.grade}</td>
                                                                                                                                      <td>
                                                                                                                                                          <button class="edit-btn" data-id="${student.id}">Edit</button>
                                                                                                                                                                              <button class="delete-btn" data-id="${student.id}">Delete</button>
                                                                                                                                                                                              </td>
                                                                                                                                                                                                          `;
                                                      studentTableBody.appendChild(tr);
                                        });

          document.querySelectorAll('.edit-btn').forEach(btn => {
                        btn.addEventListener('click', () => editStudent(btn.dataset.id));
          });

          document.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => deleteStudent(btn.dataset.id));
          });
                              }

                              async function saveStudent(e) {
                                        e.preventDefault();
                                        const studentData = {
                                                      name: nameInput.value,
                                                      email: emailInput.value,
                                                      course: courseInput.value,
                                                      grade: gradeInput.value
                                        };

          const id = studentIdInput.value;

          if (id) {
                        const { error } = await _supabase
                            .from('students')
                            .update(studentData)
                            .eq('id', id);
                        if (error) alert(error.message);
          } else {
                        const { error } = await _supabase
                            .from('students')
                            .insert([studentData]);
                        if (error) alert(error.message);
          }

          studentForm.reset();
                                        studentIdInput.value = '';
                                        saveBtn.textContent = 'Add Student';
                                        fetchStudents();
                              }

                              async function editStudent(id) {
                                        const { data, error } = await _supabase
                                            .from('students')
                                            .select('*')
                                            .eq('id', id)
                                            .single();

          if (error) return alert(error.message);

          nameInput.value = data.name;
                                        emailInput.value = data.email;
                                        courseInput.value = data.course;
                                        gradeInput.value = data.grade;
                                        studentIdInput.value = data.id;
                                        saveBtn.textContent = 'Update Student';
                              }

                              async function deleteStudent(id) {
                                        if (!confirm('Are you sure?')) return;
                                        const { error } = await _supabase
                                            .from('students')
                                            .delete()
                                            .eq('id', id);
                                        if (error) alert(error.message);
                                        fetchStudents();
                              }

                              studentForm.addEventListener('submit', saveStudent);
      fetchStudents();
});

