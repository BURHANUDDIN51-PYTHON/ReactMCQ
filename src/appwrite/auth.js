import {Client, Account, ID} from 'appwrite';
import conf from '../conf/conf';


export class AuthServices {

    // create a client
    client = new Client();
    account;

    
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        this.account = new Account(this.client)
    }

    // create an account
    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount){
                // Log in the user
                return this.login({email, password});
            } else {
                return userAccount;
            }
        } catch (error){
            throw error;
        }
    }

    // Login the user
    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password);
        }
        catch (error){
            throw error;
        }
    }

      // Check whether the user is logged in
      async getCurrentUser() {
        try {
            return await this.account.get();
        }
        catch (error){
            console.log('Appwrite services :: getCurrentUser :: error :: ', error.message);
        }
        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
            
        } catch (error) {
            console.log('Appwrite services :: logout :: error', error)
        }
        
    }

}

const authService = new AuthServices();
export default authService;