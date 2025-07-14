
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  routes: any[];
  notes: any[];
  points: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const supabaseUrl = "https://hscuxtrojlrbhixejtbu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzY3V4dHJvamxyYmhpeGVqdGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjg5MjMsImV4cCI6MjA2NzkwNDkyM30._0JCS4WIcXwH9I1k5C5N1RLcjtjAhdDlB6ZgRwdmM1U";

export const supabaseClient = {
  async signUp({ email, password, name }: LoginCredentials & { name: string }) {
    email = email.trim().toLowerCase();

    const existingUser = await this.getUser(email);
    if (existingUser) throw new Error("Este email já está cadastrado");

    const id = crypto.randomUUID();

    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        id,
        email,
        name,
        password, // Idealmente, use bcrypt aqui
        routes: [],
        notes: [],
        points: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error("Erro ao criar conta: " + errorData);
    }

    const userData = await response.json();
    return userData[0];
  },


  async signIn({ email, password }: LoginCredentials) {
    email = email.trim().toLowerCase();

    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });

    const users = await response.json();

    if (!users.length) throw new Error("Email não encontrado");

    const user = users[0];

    if (user.password !== password) {
      // Em produção, use bcrypt.compareSync(password, user.password)
      throw new Error("Senha incorreta");
    }

    return user;
  },


  async getUser(email: string): Promise<User | null> {
    console.log('Buscando dados do usuário:', email);

    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      }
    });

    const data = await response.json();
    console.log('Dados do usuário encontrados:', data);

    return data[0] || null;
  },

  async updateUser(email: string, updates: Partial<User>) {
    console.log('Atualizando usuário:', email, updates);

    console.log("Payload enviado ao Supabase:", JSON.stringify(updates, null, 2));

    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar dados do usuário");
    }

    console.log('===============================================');
    console.log("Status da resposta:", response.status);

    // ✅ Lê o corpo só uma vez
    const json = await response.json();

    console.log("Resposta do Supabase:", json); // 👈 já contém os dados atualizados ou []

    return json; // 👈 reusa aqui
  }

};
