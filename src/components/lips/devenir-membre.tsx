'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  UserPlus,
  CheckCircle2,
  FileText,
  CreditCard,
  BadgeCheck,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/lips/i18n/language-context';

// Rôles en anglais (valeurs attendues par l'API)
const ROLE_OPTIONS = [
  { value: 'IMAM', label: 'Imam' },
  { value: 'PREDICATEUR', label: 'Prédicateur' },
  { value: 'RESPONSABLE_REGIONAL', label: 'Responsable Régional' },
  { value: 'MEMBRE_CHOURA', label: 'Membre Choura' },
  { value: 'AUTRE', label: 'Autre' },
]

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: 'Faible', color: 'bg-red-500' }
  if (score <= 2) return { score: 2, label: 'Moyen', color: 'bg-amber-500' }
  if (score <= 3) return { score: 3, label: 'Bon', color: 'bg-lips-green' }
  return { score: 4, label: 'Fort', color: 'bg-emerald-500' }
}

export default function DevenirMembreSection() {
  const { p } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMatricule, setSuccessMatricule] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    region: '',
    role: '',
    mosque: '',
    password: '',
    confirmPassword: '',
  });

  const STEPS = [
    {
      icon: FileText,
      title: `1. ${p.devenirMembre.steps.apply.title}`,
      desc: p.devenirMembre.steps.apply.desc,
    },
    {
      icon: BadgeCheck,
      title: `2. ${p.devenirMembre.steps.validate.title}`,
      desc: p.devenirMembre.steps.validate.desc,
    },
    {
      icon: CreditCard,
      title: `3. ${p.devenirMembre.steps.pay.title}`,
      desc: p.devenirMembre.steps.pay.desc,
    },
    {
      icon: CheckCircle2,
      title: `4. ${p.devenirMembre.steps.card.title}`,
      desc: p.devenirMembre.steps.card.desc,
    },
  ];

  const BENEFITS = [
    p.devenirMembre.benefits.nationalCard,
    p.devenirMembre.benefits.training,
    p.devenirMembre.benefits.representation,
    p.devenirMembre.benefits.network,
    p.devenirMembre.benefits.resources,
    p.devenirMembre.benefits.community,
  ];

  return (
    <section
      ref={sectionRef}
      id="devenir-membre"
      className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-lips-cream via-[#F8F5EF] to-lips-cream relative overflow-hidden"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-lips-emerald/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-lips-gold/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-lips-green/10 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-lips-green animate-pulse" />
            <span className="text-xs font-black text-lips-green tracking-widest uppercase">
              {p.devenirMembre.sectionTag}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2E17] mb-6 tracking-tight">
            {p.devenirMembre.sectionTitle}
          </h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            {p.devenirMembre.sectionDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Steps & Benefits (takes 5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-12"
          >
            {/* Steps Timeline */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A2E17] to-lips-green flex items-center justify-center shadow-xl shadow-lips-green/20">
                  <UserPlus className="h-6 w-6 text-lips-gold" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-[#0A2E17]">
                  {p.devenirMembre.howToJoin}
                </h3>
              </div>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-lips-green/30 before:via-lips-gold/30 before:to-transparent">
                {STEPS.map((step, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    key={step.title} 
                    className="relative flex items-start justify-between gap-6 group"
                  >
                    <div className="flex flex-col items-center justify-start z-10">
                      <div className="w-12 h-12 rounded-full bg-white border-4 border-[#F8F5EF] shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-lips-gold/30 group-hover:bg-[#0A2E17] group-hover:text-lips-gold transition-all duration-300 text-lips-green">
                        <step.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow group-hover:border-lips-green/20">
                      <div className="font-bold text-lg text-[#0A2E17] mb-2">{step.title}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#0A2E17] rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:rotate-12 group-hover:scale-110">
                <BadgeCheck className="w-48 h-48 text-white" />
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lips-gold to-yellow-200" />
              
              <h4 className="font-black text-2xl text-white mb-8 relative z-10 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-lips-gold animate-pulse" />
                {p.devenirMembre.benefitsTitle}
              </h4>
              <div className="grid grid-cols-1 gap-4 relative z-10">
                {BENEFITS.map((benefit, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    key={benefit} 
                    className="flex items-center gap-4 text-[15px] font-medium text-white/90 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-lips-gold/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-lips-gold" />
                    </div>
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form (takes 7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-white shadow-2xl shadow-[#0A2E17]/5 relative z-20">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lips-gold via-[#0A2E17] to-lips-emerald rounded-t-[2.5rem]" />
              
              <div className="mb-10 text-center">
                <h3 className="text-3xl font-black text-[#0A2E17] mb-3">{p.devenirMembre.formTitle}</h3>
                <p className="text-base text-muted-foreground font-medium">{p.devenirMembre.sectionDesc}</p>
              </div>

              {submitted && !error ? (
                <div className="text-center py-16">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-28 h-28 rounded-full bg-lips-emerald/10 border border-lips-emerald/20 flex items-center justify-center mx-auto mb-8 shadow-inner"
                  >
                    <CheckCircle2 className="h-14 w-14 text-lips-emerald" />
                  </motion.div>
                  <h4 className="font-black text-3xl text-[#0A2E17] mb-4">{p.devenirMembre.submitted}</h4>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Votre demande d'adhésion a été soumise avec succès.
                  </p>
                  {successMatricule && (
                    <div className="mt-6 inline-block bg-lips-green/5 border border-lips-green/20 rounded-xl px-8 py-4">
                      <p className="text-sm text-muted-foreground">Votre matricule</p>
                      <p className="text-2xl font-mono font-bold text-lips-green">{successMatricule}</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-4 leading-relaxed">
                    Un administrateur validera votre compte sous peu. Vous recevrez une notification par email.
                  </p>
                  <Button
                    className="mt-10 bg-[#0A2E17] hover:bg-lips-green text-white rounded-xl px-10 h-14 font-bold text-lg shadow-xl shadow-lips-green/20 transition-all hover:scale-105"
                    onClick={() => {
                      setSubmitted(false);
                      setError('');
                      setSuccessMatricule('');
                      setFormData({ nom: '', prenom: '', email: '', telephone: '', region: '', role: '', mosque: '', password: '', confirmPassword: '' });
                    }}
                  >
                    {p.devenirMembre.newApplication}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    setLoading(true);

                    // Validation côté client
                    if (formData.password !== formData.confirmPassword) {
                      setError('Les mots de passe ne correspondent pas');
                      setLoading(false);
                      return;
                    }

                    if (formData.password.length < 8) {
                      setError('Le mot de passe doit contenir au moins 8 caractères');
                      setLoading(false);
                      return;
                    }

                    try {
                      const res = await fetch('/api/public/adherer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          nom: formData.nom,
                          prenom: formData.prenom,
                          email: formData.email,
                          telephone: formData.telephone,
                          region: formData.region || undefined,
                          role: formData.role || undefined,
                          mosque: formData.mosque || undefined,
                          password: formData.password,
                        }),
                      });

                      const data = await res.json();

                      if (!res.ok) {
                        setError(data.error || 'Une erreur est survenue');
                        setLoading(false);
                        return;
                      }

                      setSuccessMatricule(data.matricule);
                      setSubmitted(true);
                    } catch (err) {
                      console.error('Erreur adhésion:', err);
                      setError('Erreur de connexion au serveur. Veuillez réessayer.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="space-y-7"
                >
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <User className="h-4 w-4" /> {p.devenirMembre.firstName}
                      </label>
                      <Input 
                        placeholder="Mamadou" 
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                        required 
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] ml-6 transition-colors group-focus-within:text-lips-green">{p.devenirMembre.lastName}</label>
                      <Input 
                        placeholder="SY" 
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <Mail className="h-4 w-4" /> {p.devenirMembre.email}
                      </label>
                      <Input 
                        type="email" 
                        placeholder="mamadou.sy@exemple.sn" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                        required 
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <Phone className="h-4 w-4" /> {p.devenirMembre.phone}
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="+221 77 123 45 67" 
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <MapPin className="h-4 w-4" /> {p.devenirMembre.region}
                      </label>
                      <Input 
                        placeholder="Dakar, Saint-Louis..." 
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <Building className="h-4 w-4" /> {p.devenirMembre.role}
                      </label>
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full h-14 rounded-xl border-transparent bg-[#F8F5EF] px-4 text-base font-medium focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all appearance-none cursor-pointer" 
                      >
                        <option value="">{p.devenirMembre.selectPlaceholder}</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                      <span className="w-5 h-5 rounded-full bg-lips-green/10 flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 rounded-full bg-lips-green" />
                      </span>
                      {p.devenirMembre.mosque}
                    </label>
                    <Input 
                      placeholder={p.devenirMembre.mosquePlaceholder} 
                      value={formData.mosque}
                      onChange={(e) => setFormData({ ...formData, mosque: e.target.value })}
                      className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base" 
                    />
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <Lock className="h-4 w-4" /> Mot de passe
                      </label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Au moins 8 caractères"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base pr-12"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  level <= getPasswordStrength(formData.password).score
                                    ? getPasswordStrength(formData.password).color
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${
                            getPasswordStrength(formData.password).score <= 1
                              ? 'text-red-500'
                              : getPasswordStrength(formData.password).score <= 2
                              ? 'text-amber-500'
                              : 'text-lips-green'
                          }`}>
                            {getPasswordStrength(formData.password).label}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-bold text-[#0A2E17] flex items-center gap-2 transition-colors group-focus-within:text-lips-green">
                        <Lock className="h-4 w-4" /> Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Répétez le mot de passe"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="h-14 rounded-xl bg-[#F8F5EF] border-transparent focus:bg-white focus:border-lips-gold focus:ring-4 focus:ring-lips-gold/10 transition-all text-base pr-12"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs text-lips-green mt-1 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Mots de passe identiques
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#0A2E17] hover:bg-lips-green text-white h-16 rounded-xl font-black text-xl shadow-2xl shadow-[#0A2E17]/20 transition-all hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                          Création du compte...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-6 w-6 mr-3" />
                          {p.devenirMembre.submit}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-5 bg-lips-cream/50 rounded-xl border border-lips-cream mt-8 flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-lips-green shrink-0 mt-0.5" />
                    <p className="text-xs text-[#0A2E17]/60 leading-relaxed font-medium">
                      {p.devenirMembre.conditions}
                    </p>
                  </div>
                </form>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
