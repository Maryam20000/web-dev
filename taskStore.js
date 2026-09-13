// taskStore.js - نظام إدارة المهام واختبار API

class TaskStore {
  constructor() {
    this.tasks = [];
  }

  // 1. إضافة مهمة جديدة
  addTask(title, priority = 'Medium') {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    console.log(`✅ تم إدراج المهمة: "${title}" (أولوية: ${priority})`);
    return newTask;
  }

  // 2. تحديث حالة المهمة (مكتملة / غير مكتملة)
  toggleTaskStatus(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      console.log(`🔄 تم تغيير حالة المهمة "${task.title}" إلى: ${task.completed ? 'مكتملة ✔️' : 'غير مكتملة ❌'}`);
      return task;
    }
    console.log(`❌ لم يتم العثور على مهمة بالرقم: ${id}`);
    return null;
  }

  // 3. حذف مهمة
  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const removed = this.tasks.splice(index, 1)[0];
      console.log(`🗑️ تم حذف المهمة: "${removed.title}"`);
      return removed;
    }
    console.log(`❌ لم يتم العثور على مهمة بالرقم: ${id}`);
    return null;
  }

  // 4. عرض جميع المهام
  listTasks() {
    console.log('\n--- 📋 قائمة المهام الحالية ---');
    if (this.tasks.length === 0) {
      console.log('لا يوجد مهام حالياً.');
      return;
    }
    this.tasks.forEach((t, i) => {
      console.log(`${i + 1}. [${t.completed ? '✔' : ' '}] ${t.title} (${t.priority}) - ID: ${t.id}`);
    });
    console.log('-------------------------------\n');
  }

  // 5. جلب بيانات مهام من API خارجي (JSONPlaceholder)
  async fetchExternalTasks(limit = 3) {
    console.log(`\n📡 جاري جلب ${limit} مهام من API خارجي...`);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`);
      if (!response.ok) throw new Error('فشل الاتصال بالـ API');
      
      const externalData = await response.json();
      externalData.forEach(item => {
        this.addTask(`[مستورد] ${item.title}`, 'Low');
      });
      console.log('🎉 تم جلب المهام الخارجية بنجاح!\n');
    } catch (error) {
      console.error('❌ حدث خطأ أثناء جلب المهام:', error.message);
    }
  }
}

// ----------------------------------------------------
// 🔥 تجربة واختبار النظام (Run Test)
// ----------------------------------------------------
async function main() {
  const store = new TaskStore();

  console.log('=== بداية اختبار TaskStore ===\n');

  // إضافة مهام محلياً
  const task1 = store.addTask('إعداد تقرير المشروع', 'High');
  const task2 = store.addTask('مراجعة أكواد الصفحة الرئيسية', 'Medium');

  store.listTasks();

  // تغيير حالة مهمة
  store.toggleTaskStatus(task1.id);
  store.listTasks();

  // جلب مهام من API خارجي
  await store.fetchExternalTasks(3);
  store.listTasks();

  // حذف مهمة
  store.deleteTask(task2.id);
  store.listTasks();

  console.log('=== اكتمل الاختبار بنجاح ===');
}

main();