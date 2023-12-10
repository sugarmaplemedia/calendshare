export default {
	email: (email?: string) => {
		if (email?.match(/^[^\s@]+@[^\s@]+\.[a-zA-Z]+$/) == undefined) {
			throw EmailValidationError
		}
	},
	password: (password?: string) => {
		if (!password || password.length < 6) {
			throw PasswordValidationError
		}
	}
}

const EmailValidationError = new Error("Email is invalid")
const PasswordValidationError = new Error("Password is invalid")
