import React from 'react'

import { useState } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Paragraph, Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'

interface AccordionProps {
  index: number
}

const styles = StyleSheet.create({
  view: {
    marginTop: 10,
  },
  textFont: {
    fontSize: 12,
  },
  boldUnderlineText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  boldText: {
    fontWeight: 'bold',
  },
})

const treemamaUrl = 'https://treemama.org'
const iTreeUrl = 'https://api.itreetools.org'
const PlantidUrl = 'https://web.plant.id'
const SciStarterUrl = 'https://scistarter.org'

const questionTitles = ['What is SciStarter?', 'What is iSeaTree?']

export const Accordion = (props: AccordionProps) => {
  const [expanded, setExpanded] = useState(false)

  const toggleAccordion = () => {
    setExpanded(!expanded)
  }

  async function openWebSite(url: string) {
    const canOpen: boolean = await Linking.canOpenURL(url)

    if (!canOpen) {
      return
    }

    Linking.openURL(url)
  }

  const sciStarterContent = () => {
    return (
      <>
        <Paragraph style={styles.textFont}>
          <Text style={styles.boldText}>SciStarter </Text>
          <Text>
            a research affiliate of North Carolina State University (NCSU) and Arizona State
            University (ASU), is the largest online database of searchable citizen science projects.
            Millions of people, including 150,000 registered users, turn to SciStarter to find,
            join, and contribute to more than 3,000 searchable research projects in need of their
            help.{' '}
          </Text>
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(SciStarterUrl)}>
            Learn more
          </Text>
        </Paragraph>
        <Paragraph style={styles.textFont}>
          <Text>
            {'\n'}SciStarter offers free accounts for anyone who wants to register their project,
            event, or tool on its website and for anyone who wants to keep track of the projects
            they save, contribute to, or share with others.
          </Text>
        </Paragraph>
        <Paragraph style={styles.textFont}>
          <Text>
            {'\n'}Volunteers can earn credit for their participation in their SciStarter dashboard,
            across all kinds of projects and platforms.
          </Text>
        </Paragraph>
        <Paragraph style={styles.textFont}>
          <Text>{'\n'}iSeaTree is a </Text>
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(SciStarterUrl)}>
            SciStarter
          </Text>
          <Text> affiliated project.</Text>
        </Paragraph>
      </>
    )
  }

  const iSeaTreeContent = () => {
    return (
      <>
        <Paragraph style={styles.textFont}>
          <Text style={styles.boldText}>iSeaTree</Text> is an application designed by{' '}
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(treemamaUrl)}>
            treemama.org{' '}
          </Text>
          and Copyrighted ©2020-2023 by the project contributors. Please ALWAYS exercise caution and
          awareness of your surroundings when surveying trees. The iSeaTree project takes no
          responsibility for improper harm made when surveying a tree. We also request that tree
          surveys take place on public property OR at sites where the landowner has given full
          permission to the surveyor.
        </Paragraph>
        <Paragraph style={styles.textFont}>
          <Text>{'\n'}The iSeaTree project thanks USFS </Text>
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(iTreeUrl)}>
            iTreeAPI
          </Text>
          <Text> team and FlowerChecker's </Text>
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(PlantidUrl)}>
            Plant.id
          </Text>
          <Text> for their support of this project.</Text>
        </Paragraph>
        <Paragraph style={styles.textFont}>
          <Text>{'\n'}iSeaTree is a </Text>
          <Text style={styles.boldUnderlineText} onPress={() => openWebSite(SciStarterUrl)}>
            SciStarter
          </Text>
          <Text> affiliated project.</Text>
        </Paragraph>
      </>
    )
  }

  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={toggleAccordion}>
        <Paragraph>
          <Text>
            {questionTitles[props.index]}{' '}
            {expanded ? (
              <Icon name="chevron-up" type="Ionicons" color="black" size={15} />
            ) : (
              <Icon name="chevron-down" type="Ionicons" color="black" size={15} />
            )}
          </Text>
        </Paragraph>
      </TouchableOpacity>
      {expanded && (props.index === 0 ? sciStarterContent() : iSeaTreeContent())}
    </View>
  )
}
