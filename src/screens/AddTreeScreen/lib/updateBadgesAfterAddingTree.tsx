import { SpeciesData } from '../SpeciesSelect'
import {
  getCurrentAuthUser,
  UserData,
  updateBadges as updateBadgesAndTreesCount,
} from '../../../lib/firebaseServices'
import { FormValues } from '../addTreeForm'

export function updateBadgesAfterAddingTree(
  formValues: FormValues,
  user: UserData,
  uid: string,
) {
  if (!user.badges) {
    user.badges = []
  }
  if (!user.treesCount) {
    user.treesCount = 0
  }

  let speciesData: SpeciesData | null = formValues.speciesData
  let badgesAwarded = []
  if (speciesData && 'LEVEL' in speciesData) {
    if (speciesData.LEVEL == 'easy' && !user.badges.includes('SEEDLING')) {
      user.badges.push('SEEDLING')
      badgesAwarded.push('SEEDLING')
    }
    if (speciesData.LEVEL == 'medium' && !user.badges.includes('SAPLING')) {
      user.badges.push('SAPLING')
      badgesAwarded.push('SAPLING')
    }
    if (speciesData.LEVEL == 'expert' && !user.badges.includes('OLD_GROWTH_EXPERT')) {
      user.badges.push('OLD_GROWTH_EXPERT')
      badgesAwarded.push('OLD_GROWTH_EXPERT')
    }
  }

  if (formValues.dbh && !user.badges.includes('DBH')) {
    user.badges.push('DBH')
    badgesAwarded.push('DBH')
  }

  if (user.treesCount == 0) {
    user.badges.push('FIRST_TREE')
    badgesAwarded.push('FIRST_TREE')
  }
  if (user.treesCount == 4) {
    user.badges.push('FIFTH_TREE')
    badgesAwarded.push('FIFTH_TREE')
  }
  if (user.treesCount == 9) {
    user.badges.push('TENTH_TREE')
    badgesAwarded.push('TENTH_TREE')
  }
  user.treesCount++

  let promise = updateBadgesAndTreesCount(uid, user.badges, user.treesCount)

  return {badgesAwarded, promise}
}
