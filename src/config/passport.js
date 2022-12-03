import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasena'
}, (usuario, contrasena, done) => {

    if (usuario === "adminATI" && contrasena === "sudoITESI") {
        return done(null, { id: 1, name: 'admin' })
    }
    done(null, false)
}))

passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
})

passport.deserializeUser((id, done) => {
    done(null, { id: 1, name: 'admin' })
})