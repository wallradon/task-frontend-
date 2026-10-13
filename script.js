let tasks = [];
// let tasks = [
//     { id: 1, title: "เรียน HTML/CSS เบื้องต้น", completed: true, priority: "low" },
//     { id: 2, title: "เขียน JavaScript ES6", completed: false, priority: "high" },
//     { id: 3, title: "เชื่อมต่อ Database", completed: false, priority: "medium" }
// ];
console.table(tasks);

// กรองเฉพาะงานที่ยังไม่เสร็จ
let incompleteTasks = tasks.filter(task => task.completed === false);
console.log("งานที่ยังไม่เสร็จ:");
console.table(incompleteTasks);

// 3. การวนลูปแสดงผล
const displayTasks = () => {
    console.log("--- รายการงานทั้งหมด ---");
    tasks.forEach(task => {
        // ใช้ตัวแปร status เก็บเครื่องหมาย [x] หรือ [ ]
        const status = task.completed ? "[x]" : "[ ]";
        // ใช้ Template Literals (` `) ในการต่อข้อความ
        console.log(`${status} ID: ${task.id} - ${task.title} (ความสำคัญ: ${task.priority})`);
    });

};
displayTasks();
const taskListElement = document.querySelector('#taskList');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const priorityInput = document.querySelector('#priorityInput');
const API_URL = 'https://task-backend-cpe-min.onrender.com';

const fetchTasks = async () => {
    try {
        taskListElement.innerHTML = "<h3 style='text-align: center;'>⏳ กำลังดึงข้อมูลจากเซิร์ฟเวอร์...</h3>";
        const response = await fetch(`${API_URL}/tasks`);
        const data = await response.json();

        tasks = data.map(item => {
            return {
                id: item._id,
                title: item.title,
                completed: item.completed,
                priority: item.priority || "low"
            };
        });

        renderTasks();
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        taskListElement.innerHTML = "<h3 style='text-align: center; color: red;'>❌ ไม่สามารถดึงข้อมูลได้กรุณาลองใหม่</h3>";
    }
};

const renderTasks = () => {
    if (tasks.length === 0) {
        taskListElement.innerHTML = "<p>🎉 เยี่ยมมาก! ไม่มีงานค้างเลย</p>";
        return;
    }

    const htmlString = tasks.map(task => {
        const textStyle = task.completed ? "text-decoration: line-through; color: gray;" : "";

        return `
            <div class="task-card">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" onchange="handleToggle('${task.id}')" ${task.completed ? 'checked' : ''}>
                    <span style="${textStyle}">${task.title} <small>(${task.priority})</small></span>
                </div>
                <button onclick="handleDelete('${task.id}')" style="color: red; cursor: pointer;">ลบ</button>
            </div>
        `;
    }).join('');

    taskListElement.innerHTML = htmlString;
};


taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newTitle = taskInput.value;
    const newPriority = priorityInput.value;

    addTask(newTitle, newPriority);
    taskInput.value = '';
});

const handleDelete = (id) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) {
        deleteTask(id);
    }
};

const handleToggle = (id) => {
    toggleTaskStatus(id);
};

fetchTasks();

// 4. ค้นหางานด้วย ID
const getTaskById = (id) => {
    return tasks.find(task => task.id === id);
};
console.log("ค้นหางาน ID 2:", getTaskById(2));

// 5. กรองข้อมูลตามเงื่อนไข (ด่วนและยังไม่เสร็จ)
const getUrgentTasks = () => {
    return tasks.filter(task => !task.completed && task.priority === "high");
};
console.log("งานด่วนที่ยังไม่เสร็จ:");
console.table(getUrgentTasks());

// 6. ดึงข้อมูลมาแค่บางส่วน (title) ด้วย .map()
const taskTitles = tasks.map(task => task.title);
console.log("ชื่อของงานทั้งหมด:", taskTitles);

// 7. ฟังก์ชันเพิ่มงานใหม่ (Create)
const addTask = async (title, priority) => {
    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title, priority: priority })
        });
        
        fetchTasks();
    } catch (error) {
        console.error("เพิ่มงานไม่สำเร็จ:", error);
    }
};

// ทดสอบเรียกใช้งาน
// addTask("ออกแบบ UI ตัวใหม่", "high");
// console.table(tasks); // ตรวจสอบว่างานเพิ่มเข้าไปหรือยัง

// 8. ฟังก์ชันเปลี่ยนสถานะ (Update)
const toggleTaskStatus = async (id) => {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT'
        });
        fetchTasks();
    } catch (error) {
        console.error("เปลี่ยนสถานะไม่สำเร็จ:", error);
    }
};

// 9. ฟังก์ชันลบงาน (Delete)
const deleteTask = async (id) => {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    } catch (error) {
        console.error("ลบงานไม่สำเร็จ:", error);
    }
};

// 10. ทดลองเรียกใช้ฟังก์ชันต่อเนื่องกันเป็นเนื้อเรื่อง (Scenario)
// 10.1 เรียก addTask ตามชื่อที่ผู้ใช้กำหนด
// addTask("วรดร เตรียมปลายภาค", "high");
// addTask("วรดร เตรียมกลางภาค", "medium");
// addTask("วรดร ทำเวปโปรแกรมมิ่ง", "high");

// 10.2 เรียก toggleTaskStatus(2)
// toggleTaskStatus(2);

// // 10.3 เรียก deleteTask(1)
// deleteTask(1);

// 10.4 เรียก displayTasks()
console.log("--- ข้อ 10.4 ผลลัพธ์สุดท้าย ---");
displayTasks();
