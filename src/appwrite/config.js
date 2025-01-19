import conf from '../conf/conf.js'
import {Client, Databases, Query, ID} from 'appwrite';


export class DatabaseService {
    
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
    }


    // use the async functions to do the database operation

    // Add a question to the database
    async addQuestion({question, subject, options, correctAnswer}) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    question,
                    options,
                    subject,
                    correctAnswer
                }
            )
        } catch (error) {
            console.log("Appwrite service :: addQuestion :: error", error);
        }
    }

    // Edit or update a questoin in the database
    async editQuestion(slug, {question, subject, options, correctAnswer}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    question,
                    subject,
                    options,
                    correctAnswer
                }
            )
        } catch (error) {
            console.log("Appwrite service :: editQuestion :: error", error);
        }
    }

    // Delete a question from the database
    async deleteQuestion(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteQuestion :: error", error);
            return false;
        }}
    
    // Get a single question from the database
    async getQuestion(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite service :: getQuestion :: error", error);
            return false;
        }}

    // Get all the questions from the database
    async getAllQuestions() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
            );
        } catch (error) {
            console.log("Appwrite service :: getAllQuestions :: error", error);
            return false;
        }
}
}
const databaseService = new DatabaseService();
export default databaseService;