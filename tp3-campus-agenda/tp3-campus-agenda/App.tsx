import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const mode: 'tous' | 'ateliers' = 'tous';

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): 'Complet' | 'Presque complet' | 'Ouvert' {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r >= 1 && r <= 3) return 'Presque complet';
  return 'Ouvert';
}

type BadgeProps = { statut: 'Complet' | 'Presque complet' | 'Ouvert' };

function BadgeEtat({ statut }: BadgeProps) {
  const isComplet = statut === 'Complet';
  const isPresque = statut === 'Presque complet';

  return (
    <View style={[
      styles.badge,
      isComplet ? styles.badgeComplet : isPresque ? styles.badgePresque : styles.badgeOuvert
    ]}>
      <Text style={[
        styles.texteBadge,
        isComplet ? styles.texteComplet : isPresque ? styles.textePresque : styles.texteOuvert
      ]}>
        {statut === 'Complet' ? 'Inscriptions Complet' : `${placesRestantes({ capacite: 0, inscrits: 0, id: '', titre: '', categorie: '' } as any)} places libres`}
      </Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const r = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte}>{evenement.titre}</Text>
        <View style={[
          styles.badge,
          r === 0 ? styles.badgeComplet : r <= 3 ? styles.badgePresque : styles.badgeOuvert
        ]}>
          <Text style={styles.texteBadge}>
            {r === 0 ? 'Inscriptions Complet' : `${r} places libres`}
          </Text>
        </View>
      </View>
      <Text style={styles.information}>Catégorie: {evenement.categorie}</Text>
      <Text style={styles.information}>Capacité: {evenement.capacite} | Inscrits: {evenement.inscrits}</Text>
    </View>
  );
}

type BlocProps = { libelle: string; valeur: string | number };

function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.blocStat}>
      <Text style={styles.valeurStat}>{valeur}</Text>
      <Text style={styles.libelleStat}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const evenementsAffiches = mode === 'tous' 
    ? evenements 
    : evenements.filter(e => e.categorie === 'Atelier' && placesRestantes(e) > 0);

  const totalEvenements = evenements.length;
  const evenementsComplets = evenements.filter(e => placesRestantes(e) === 0).length;
  const evenementsAvecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
  const sommePlacesRestantes = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.titrePrincipal}>Campus Agenda</Text>
      <Text style={styles.sousTitre}>Événements du campus</Text>

      <View style={styles.containerStats}>
        <BlocStatistique libelle="événements" valeur={totalEvenements} />
        <BlocStatistique libelle="places restantes" valeur={sommePlacesRestantes} />
      </View>

      <Text style={styles.titreMode}>
        {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
      </Text>

      {evenementsAffiches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun événement à afficher</Text>
        </View>
      ) : (
        evenementsAffiches.map(evenement => (
          <CarteEvenement key={evenement.id} evenement={evenement} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#F2F7FD',
    flexGrow: 1,
  },
  titrePrincipal: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#00235C',
  },
  sousTitre: {
    color: '#4C5360',
    marginTop: 5,
    marginBottom: 18,
    fontSize: 15,
  },
  containerStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  blocStat: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#DCEBFF',
    alignItems: 'center',
  },
  valeurStat: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00235C',
  },
  libelleStat: {
    fontSize: 12,
    color: '#4C5360',
    marginTop: 2,
  },
  titreMode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00235C',
    marginBottom: 12,
  },
  carte: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8E6F8',
  },
  enteteCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titreCarte: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#00235C',
    flexShrink: 1,
  },
  information: {
    color: '#3D4A5C',
    marginTop: 3,
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeComplet: {
    backgroundColor: '#FFE5E5',
  },
  badgePresque: {
    backgroundColor: '#FFF3CD',
  },
  badgeOuvert: {
    backgroundColor: '#D6F5E7',
  },
  texteBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#002350',
  },
  texteComplet: {
    color: '#A71D2A',
  },
  textePresque: {
    color: '#856404',
  },
  texteOuvert: {
    color: '#0F5132',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E6F8',
  },
  emptyText: {
    color: '#4C5360',
    fontSize: 15,
  },
});