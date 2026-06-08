interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Your email is ${user.email}.`;
}

const user: User = {
  id: 1,
  name: 'Taro',
  email: 'taro@example.com',
};

console.log(greetUser(user));
