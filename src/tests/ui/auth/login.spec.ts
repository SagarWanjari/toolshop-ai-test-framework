import { test, expect } from '@fixtures/index'
import { LoginPage } from '@pages/auth/LoginPage';
import users from '@test-data/users.json';
import { User } from '@types-custom/index';
const testUsers = users as User[];

test.describe('Login Functionality', () =>{

    test('valid user can login successfully @smoke @critical', async({loginPage})=>{
        await loginPage.goto(); 
        await loginPage.loginAs('customer');
        await loginPage.assertLoggedIn();
    });

    test('admin user can login and sees admin menu @smoke @critical', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.loginAs(users[1]!.role as 'customer'| 'admin');
        await loginPage.assertAdminMenuVisible();
    });

    test('locked account shows appropriate error @regression', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.login(users[2]!.email, users[2]!.password);
        await loginPage.assertLoginError('Invalid email or password');
    });

    test('empty email shows validation error @regression', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.login(users[3]!.email, users[3]!.password);
        await loginPage.assertFieldError('email','Email is required');
    });

    test('empty password shows validation error @regression', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.login(users[4]!.email, users[4]!.password);
        await loginPage.assertFieldError('password', 'Password is required');
    });

    test('invalid email format shows validation error @regression', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.login(users[5]!.email, users[5]!.password);
        await loginPage.assertFieldError('email','Email format is invalid');
    });

    test('user can logout successfully @smoke', async({loginPage})=>{
        await loginPage.goto();
        await loginPage.loginAs('customer');
        await loginPage.logout();
        await loginPage.assertLoggedOut();
    });
})

