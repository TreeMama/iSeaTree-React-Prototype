import React from 'react'

import {
    View,
    FlatList,
    TouchableHighlight,
    Text as RNText,
    StyleSheet,
    SafeAreaView
} from 'react-native'
import {
    useTheme,
    Button,
    TextInput,
    DefaultTheme,
} from 'react-native-paper'

import { colors } from '../styles/theme'
import speciesDataList from '../../data/species.json';

export function IdentifySpecies(props) {
    const [query, setQuery] = React.useState<undefined | string>(undefined)
    const [isSelected, setisSelected] = React.useState<null | Boolean>(false)
    const MIN_SEARCH_TERM_LENGTH = 3;
    const theme = useTheme();
    const currentSpeciesNamesItems = React.useMemo(() => {
        const { params } = props.route;
        
        return getSpeciesFlatListData(params.treeType, query)
    }, [query])

    function getSpeciesFlatListData(type: string | null, query?: string): { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] {
        const $speciesDataList: { ID: string; COMMON: string; SCIENTIFIC: string; TYPE: string }[] = []
        speciesDataList.forEach((item) => {
            if (typeof type == 'string') {
                if (type.toLowerCase() == item.TYPE.toLowerCase() || item.TYPE.toLowerCase() === 'unknown') {
                    $speciesDataList.push(item)
                } else if (type.toLowerCase() == 'null') {
                    $speciesDataList.push(item)
                }
            } else {
                $speciesDataList.push(item)
            }
        })

        if (!query) {
            return $speciesDataList
        }

        const inputValue = query.trim().toLowerCase()
        const inputLength = inputValue.length

        if (inputLength < MIN_SEARCH_TERM_LENGTH) {
            return $speciesDataList
        }

        return $speciesDataList.filter(
            (datum) =>
                datum.COMMON.toLowerCase().includes(inputValue) ||
                datum.SCIENTIFIC.toLowerCase().includes(inputValue),
        )
    }

    async function handleSpeciesSelect(speciesData: SpeciesData) {
        const { params } = props.route;
        if (!isSelected) {
            params.onSelect(speciesData);
            props.navigation.goBack();
            setisSelected(true)
        }
        setTimeout(() => {
            setisSelected(false)
        }, 1000)
    }

    function renderFlatListItem({ item }: { item: SpeciesData }) {
        return (
            <TouchableHighlight
                key={item.ID}
                onPress={() => {
                    handleSpeciesSelect(item)
                }}
                underlayColor={colors.gray[500]}
                activeOpacity={0.8}
            >
                <View
                    style={[
                        styles.listItem,
                        {
                            backgroundColor: '#fff'
                        },
                    ]}
                >
                    <RNText style={styles.listItemTitle}>{item.COMMON}</RNText>
                    <RNText style={styles.listItemDescription}>{item.SCIENTIFIC}</RNText>
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Button
                    mode="contained"
                    style={{ borderRadius: 0 }}
                >
                    done
          </Button>

                <TextInput
                    value={query}
                    onChangeText={(value) => setQuery(value)}
                    placeholder="search..."
                    mode="flat"
                    style={{ backgroundColor: theme.colors.background }}
                    theme={{ roundness: 0 }}
                    autoCorrect={false}
                />

                <FlatList
                    data={currentSpeciesNamesItems}
                    keyExtractor={(item, index) => `${item.ID}-${index}`}
                    renderItem={renderFlatListItem}
                    initialNumToRender={20}
                />
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    listItemTitle: {
        fontSize: 16,
        color: DefaultTheme.colors.text,
    },
    listItemDescription: {
        fontSize: 16,
        color: DefaultTheme.colors.backdrop,
    },
})