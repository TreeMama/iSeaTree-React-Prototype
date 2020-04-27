import { SpeciesData } from '../SpeciesSelect'
import {
  getCurrentAuthUser,
  UserData,
  updateBadges as updateBadgesAndTreesCount,
} from '../../../lib/firebaseServices'
import { FormValues } from '../addTreeForm'

export async function updateBadgesAfterAddingTree(
  formValues: FormValues,
  user: UserData,
  uid: string,
): Promise<void> {
  if (!user.badges) {
    user.badges = []
  }
  if (!user.treesCount) {
    user.treesCount = 0
  }

  let speciesData: SpeciesData | null = formValues.speciesData
  if (speciesData && 'LEVEL' in speciesData) {
    if (speciesData.LEVEL == 'easy' && !user.badges.includes('SEEDLING')) {
      user.badges.push('SEEDLING')
    }
    if (speciesData.LEVEL == 'medium' && !user.badges.includes('SAPLING')) {
      user.badges.push('SAPLING')
    }
    if (speciesData.LEVEL == 'expert' && !user.badges.includes('OLD_GROWTH_EXPERT')) {
      user.badges.push('OLD_GROWTH_EXPERT')
    }
  }

  if (formValues.dbh && !user.badges.includes('DBH')) {
    user.badges.push('DBH')
  }

  if (user.treesCount == 0) {
    user.badges.push('FIRST_TREE')
  }
  if (user.treesCount == 4) {
    user.badges.push('FIFTH_TREE')
  }
  if (user.treesCount == 9) {
    user.badges.push('TENTH_TREE')
  }
  user.treesCount++

  return updateBadgesAndTreesCount(uid, user.badges, user.treesCount)
}
